const rp = require('request-promise-native');
const moment = require('moment-timezone');
const QuestradeApi = require('../../models/questrade-api-key');
const { NEW_YORK_TIME_ZONE } = require('../../utils/time');
const Quote = require('../../models/Quote.js');
const QuoteMeta = require('../../models/QuoteMeta.js');

let refreshingToken = Promise.resolve();
const refreshToken = async ({ _user }) => {
    await refreshingToken;
    refreshingToken = new Promise(async (resolve) => {
        const api = await QuestradeApi.findOne({ _user }).exec();
        if (!api) {
            throw new Error('API not found');
        }
        const newToken = await rp({
            uri: `https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token=${api.refreshToken}`,
            json: true
        });
        api.accessToken = newToken.access_token;
        api.refreshToken = newToken.refresh_token;
        api.tokenType = newToken.token_type;
        api.apiServer = newToken.api_server;
        console.log('refreshed token');
        resolve(api.save());
    });
    return refreshingToken;
};

/**
 * send request and auto renew token if the token expires.
 */
const sendRequest = async ({ uri, queryParams, _user }) => {
    const send = async () => {
        const api = await QuestradeApi.findOne({ _user }).exec();
        if (!api) {
            throw new Error('API not found');
        }
        return rp({
            uri: `${api.apiServer}${uri}`,
            json: true,
            headers: {
                'Authorization': `Bearer ${api.accessToken}`
            },
            qs: queryParams
        });
    };
    try {
        return await send({ uri, queryParams, _user });
    } catch (e) {
        console.error(e);
        if (e.statusCode === 401 && e.response.body.code === 1017) {
            await refreshToken({ _user });
            return await send({ uri, queryParams, _user });
        }
        throw e;
    }
};
const fetchSymbolDetail = async ({ _user, symbols }) => {
    try {
        const response = await sendRequest({
            uri: 'v1/symbols',
            queryParams: {
                names: symbols.join(',')
            },
            _user
        });
        const symbolsResults = response.symbols;
        if (Array.isArray(symbolsResults)) {
            return symbolsResults;
        }
        return [];
    } catch (e) {
        console.error(e);
        return [];
    }
};
const fillMissingSymbolId = async ({ _user, symbols }) => {
    const findQuoteMetaParams = { _user };
    let metas = await QuoteMeta.find(findQuoteMetaParams).exec();
    const missingQuestradeIdSymbols = [];
    const missingMetaSymbol = new Set(symbols);
    for (const meta of metas) {
        missingMetaSymbol.delete(meta.symbol);
        if (!meta.questradeId && symbols.includes(meta.symbol)) {
            missingQuestradeIdSymbols.push(meta.symbol);
        }
    }
    missingQuestradeIdSymbols.push(...Array.from(missingMetaSymbol));
    if (!missingQuestradeIdSymbols.length) {
        return;
    }
    const symbolDetails = await fetchSymbolDetail({ _user, symbols: missingQuestradeIdSymbols });
    for (const symbolDetail of symbolDetails) {
        let quoteMeta = await QuoteMeta.findOne({ symbol: symbolDetail.symbol }).exec();
        if (quoteMeta) {
            quoteMeta.questradeId = symbolDetail.symbolId;
        } else {
            quoteMeta = new QuoteMeta({
                _user,
                symbol: symbolDetail.symbol,
                questradeId: symbolDetail.symbolId
            });
        }
        console.log(`saving symbol ${symbolDetail.symbol} id to ${symbolDetail.symbolId}`);
        await quoteMeta.save();
    }
};

exports.downloadQuotes = async ({ _user, symbols }) => {
    const findQuoteMetaParams = { _user };
    await fillMissingSymbolId({ _user, symbols });
    const metas = await QuoteMeta.find(findQuoteMetaParams).exec();
    const symbolIdMap = metas.reduce((acc, meta) => {
        acc[meta.symbol] = meta.questradeId;
        return acc;
    }, {});
    const ids = symbols.map(s => symbolIdMap && symbolIdMap[s]).filter(s => s);
    if (!ids.length) {
        throw new Error('ids not found');
    }
    try {
        console.log('Fetching quotes for', symbols);
        const response = await sendRequest({
            uri: 'v1/markets/quotes',
            queryParams: {
                ids: ids.join(',')
            },
            _user
        });
        const quotes = response.quotes;
        if (!Array.isArray(quotes)) {
            throw new Error('quote is not array');
        }
        return quotes;
    } catch (e) {
        console.error(e);
        return [];
    }
};
exports.saveQuotesFromAPI = async ({ quotes, _user }) => {
    const totalPromises = [];
    for (const quote of quotes) {
        const result = {
            meta: {},
            data: {},
            from: {}
        };
        try {
            const symbol = quote.symbol;
            let date;
            const matches = new RegExp('^(\\d{4}-\\d{2}-\\d{2})T(.*)').exec(quote.lastTradeTime);
            console.log('last trade time', quote.lastTradeTime);
            let isIntraday = true;
            if (matches) {
                date = matches[1];
                const time = matches[2];
                if (time === '00:00:00.000000-05:00' || '00:00:00.000000-04:00' ||
                    [15,16,17,18,19,20].some(s => time.startsWith(`${s}:`))) {
                    isIntraday = false;
                }
            }
            console.log('is intra day', isIntraday);
            if (!date) {
                throw new Error('date not valid');
            }
            const foundQuote = await Quote.findOne({ date, symbol, _user }).exec();
            const promises = [];
            const data = result.data;
            let quotePromise = Promise.resolve();
            if (foundQuote) {
                data[symbol] = data[symbol] || {};
                data[symbol][date] = foundQuote;
                console.log('found quote for ', symbol, date);
            } else {
                console.log('received quote for ', symbol, date);
                const newQuote = Object.assign({
                    _user,
                    isIntraday,
                    symbol: quote.symbol,
                    close: quote.lastTradePrice,
                    date
                });
                quotePromise = new Quote(newQuote).save().then(savedQuote => {
                    data[symbol] = data[symbol] || {};
                    data[symbol][date] = savedQuote;
                });
            }
            promises.push(quotePromise);
            const lastRefreshed = moment.tz(NEW_YORK_TIME_ZONE).format('YYYY-MM-DD HH:MM:SS');
            const metaPromise = QuoteMeta.findOne({ symbol, _user }).exec()
                .then(foundMeta => {
                    let quoteMeta;
                    let refereshTimeKey = isIntraday ? 'lastRefreshedIntraday' : 'lastRefreshedDaily';
                    if (foundMeta) {
                        quoteMeta = foundMeta;
                        quoteMeta[refereshTimeKey] = isIntraday ?
                            lastRefreshed :
                            date;
                    } else {
                        quoteMeta = new QuoteMeta({
                            _user,
                            isIntraday,
                            symbol: quote.symbol,
                            [refereshTimeKey]: lastRefreshed
                        });
                    }
                    return quoteMeta.save().then(savedMeta => result.meta[symbol] = savedMeta);
                });
            promises.push(metaPromise);
            totalPromises.push(Promise.all(promises).then(
                () => {
                    result.from[symbol] = 'api';
                    return result;
                },
                error => {
                    return Promise.reject(error);
                }
            ));
        } catch (e) {
            console.error(e);
            totalPromises.push(Promise.resolve(result));
        }
    }
    return Promise.all(totalPromises);
};