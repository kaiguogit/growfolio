import types from '../constants/actionTypes';
import $ from 'jquery';
import Auth from '../services/Auth';
import { num, log, getHeaders } from '../utils';

import * as currencyActions from './currency';
import { batchActions } from './';
import { getHoldings, getRealTimeRate } from '../selectors';
// import fakeQuotes from './fakeData/quotes';

const REFRESH_QUOTES_INTERVAL = 600000;
const REFRESH_QUOTES_TIMEOUT = 15000;

export const requestQuotes = () => ({
    type: types.REQUEST_QUOTES
});

export const requestQuotesTimeout = () => ({
    type: types.REQUEST_QUOTES_TIMEOUT
});

export const receiveQuotes = (quotes) => ({
    type: types.RECEIVE_QUOTES,
    receivedAt: Date.now(),
    quotes
});

export const setQuoteDisplayDate = date => dispatch => {
    let setDate = (date) => ({
        type: types.SET_QUOTE_DISPLAY_DATE,
        date
    });
    dispatch(batchActions([
        setDate(date),
        refreshQuotes()
    ]));
};

export const setUseHistoricalQuote = (date) => ({
    type: types.SET_USE_HISTORICAL_QUOTE,
    date
});

export const toggleQuoteModal = (showModal, quote) => ({
    type: types.TOGGLE_QUOTE_MODAL,
    showModal,
    quote
});

/**
 * YAHOO Finance API version
 * makeQuotesUrl, processQuotes, fetchQuotes functions
 */
// const makeQuotesUrl = symbols => {
//     // concat symbols into \"YAHOO\",\"GOOGL\",\"AMZN\"
//     let symbolsStr = symbols.map((symbol) => '\"' + symbol + '\"').join(',');
//     let url = 'https://query.yahooapis.com/v1/public/yql';
//     let params = {
//       q: `select * from yahoo.finance.quotes where symbol in (${symbolsStr})`,
//       format:'json',
//       diagnostics: 'true',
//       env: 'store://datatables.org/alltableswithkeys',
//       callback: ''
//     };
//     return makeUrl(url, params);
// };

// const processQuotes = data => {
//     let quotes = data.query.results.quote;
//     // always return an Array.
//     quotes = Array.isArray(quotes) ? quotes : [quotes];
//     // convert to object map
//     let result = {};
//     quotes.forEach(quote => {
//         const { symbol, LastTradePriceOnly: currentPrice, Change: change} = quote;
//         result[quote.symbol] = {symbol, currentPrice, change};
//     });
//     return result;
// };

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
// export const fetchQuotes = symbols => dispatch => {
//     if (!(symbols && Array.isArray(symbols) && symbols.length)) {
//         // console.log("empty symbols, skip fetching");
//         // empty symbols, skip fetching
//         return;
//     }
//     dispatch(requestQuotes());
//     return fetch(makeQuotesUrl(symbols))
//         .then(response => response.json())
//         .then(data => {
//             console.log("response is", data);
//             let result = processQuotes(data);
//             console.log("quotes result is", result);
//             dispatch(receiveQuotes(result));
//         })
//         .catch(errorHandler);
// };

/**
 * Google Finance API
 * makeQuotesUrl, processQuotes, fetchQuotes functions
 * URL: http://finance.google.com/finance/info?client=ig&q=NASDAQ:YHOO,NASDAQ:GOOGL
 */

// Moved to backend
// const makeQuotesUrl = symbols => {
//     symbols = symbols.map(x => {
//         return x.exch ? `${x.exch}:${x.symbol}` : x.symbol;
//     });
//     let symbolsStr = symbols.join(',');
//     let url = BASE_URI + "quotes";
//     let params = {
//         q: symbolsStr
//     };
//     return makeUrl(url, params);
// };

/**
 * Google API properties http://www.jarloo.com/real-time-google-stock-api/
 * t   Ticker
 * e   Exchange
 * l   Last Price
 * ltt Last Trade Time
 * l   Price
 * lt  Last Trade Time Formatted
 * lt_dts  Last Trade Date/Time
 * c   Change
 * cp  Change Percentage
 * el  After Hours Last Price
 * elt After Hours Last Trade Time Formatted
 * div Dividend
 * yld Dividend Yield
 */
const processRealtimeQuotes = quotes => {
    // convert to object map
    const result = {};
    if (!quotes) {
        return result;
    }
    // always return an Array.
    quotes = Array.isArray(quotes) ? quotes : [quotes];
    quotes.forEach(quote => {
        const { t: symbol, l: current_price, c: change, cp: changePercent} = quote;
        result[symbol] = {
            $original: quote,
            symbol,
            price: num(current_price),
            change: num(change),
            changePercent: num(changePercent) / 100
        };
    });
    return result;
};

const processQuotes = response => {
    const meta = response['Meta Data'];
    const quotes = response['Time Series (Daily)'];
    if (response.Information) {
        log.info(response.Information);
    }
    if (meta && quotes) {
        let symbol = meta['2. Symbol'];
        const result = {};
        if (symbol && symbol.startsWith('TSX:')) {
            symbol = symbol.replace('TSX:', '');
        }
        result.symbol = symbol;
        // let lastRefreshed = meta['3. Last Refreshed'];
        // result.quote = quotes[lastRefreshed] && quotes[lastRefreshed]['4. close'] || {};
        result.quote = quotes;
        return result;
    }
    return {};
};

const processHistoricalQutes = quotes => {
    return quotes.reduce((result, quote) => {
        result[quote.symbol] = result[quote.symbol] || {};
        result[quote.symbol][quote.date] = quote;
        return result;
    }, {});
};
/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
const fetchQuotes = state => {
    if (state.quotes.useHistoricalQuote) {
        return fetchHistoricalQuotes(state);
    }
    return fetchRealTimeQuotes(state);
};

const fetchRealTimeQuotes = state => {
    const holdings = getHoldings(state);

    if (!(holdings && Array.isArray(holdings) && holdings.length)) {
        // empty symbols, skip fetching
        return Promise.resolve([]);
    }
    return Promise.all(holdings.map(holding => {
        // let symbol = holding.symbol;
        // if (holding.currency === 'CAD') {
        //     symbol = 'TSX:' + symbol;
        // }
        // return processRealtimeQuotes(data.result);

        // return $.ajax({
        //     type: 'GET',
        //     dataType: 'json',
        //     url: __MY_API__ + 'quotes',
        //     data: {symbol},
        //     headers: {
        //         Authorization: `Bearer ${Auth.getToken()}`
        //     },
        //     timeout: 3000
        // }).then(data => {
        //     if (!data.success) {
        //         return {};
        //     }
        //     return processQuotes(data.result);
        // });
        return Promise.resolve(fakeData).then(data => {
            if (!data.success) {
                return {};
            }
            return processQuotes(data.result);
        });
    })).then(quotes => {
        return quotes.reduce((result, quote) => {
            result[quote.symbol] = quote.quote;
            return result;
        }, {});
    });
};

const fetchHistoricalQuotes = state => {
    // const date = state.quotes.displayDate.format('MM-DD-YYYY');
    return $.ajax({
        type: 'GET',
        dataType: 'json',
        url: __MY_API__ + 'historical-quotes',
        data: {},
        headers: {
            Authorization: `Bearer ${Auth.getToken()}`
        },
        timeout: 3000
    }).then(data => {
        return processHistoricalQutes(data.result);
    });
};

export const createQuote = quote => (dispatch, getState) => {
    dispatch({
        type: types.ADD_QUOTE
    });
    let quoteDate = getState().quotes.displayDate;
    let quoteDateStr = quoteDate.format('MM-DD-YYYY');
    quote.date = quoteDateStr;
    return fetch(__MY_API__ + 'historical-quotes', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(quote)
    }).then(response => response.json())
    .then(() => refreshQuotes()(dispatch, getState))
    .catch(log.error);
};

export const refreshQuotes = () => (dispatch, getState) => {
    const state = getState();
    const rate = getRealTimeRate(state);
    const shouldRequestRate = rate.USDCAD === 1;
    if (shouldRequestRate) {
        dispatch(batchActions([
            requestQuotes(),
            currencyActions.requestCurrency()
        ]));
    } else {
        dispatch(requestQuotes());
    }

    let quotePromise = fetchQuotes(state);
    let currencyPromise = shouldRequestRate ? currencyActions.fetchCurrency(state): Promise.resolve();

    Promise.timeout(REFRESH_QUOTES_TIMEOUT, Promise.all([quotePromise, currencyPromise]))
    .then(([quotes, currency]) => {
        // Dispatch two receive actions together to avoid updating components twice.
        if (shouldRequestRate) {
            dispatch(batchActions([
                receiveQuotes(quotes),
                currencyActions.receiveCurrency(currency)
            ]));
        } else {
            dispatch(receiveQuotes(quotes));
        }
    }).catch((error) => {
        log.error(error);
        dispatch(batchActions([
            requestQuotesTimeout(),
            currencyActions.requestCurrencyTimeout()
        ]));
    });
};

export const setIntervalRefreshQuotes = () => (dispatch, getState) => {
    setInterval(refreshQuotes().bind(null, dispatch, getState), REFRESH_QUOTES_INTERVAL);
};

const requestDownloadQuotes = (holding) => {
    const symbol = holding.isUSD() ? holding.symbol : 'TSX:' + holding.symbol;

    // return Promise.resolve(fakeQuotes)
    return fetch(__MY_API__ + 'download-historical-quotes', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({symbol})
    }).then(response => response.json())
    .then(response => {
        if (!response.success) {
            return Promise.reject(response);
        }
        return response;
    })
    .then((data) => processHistoricalQutes(data.result));
};

export const downloadQuotes = () => (dispatch, getState) => {
    const state = getState();
    const holdings = getHoldings(state);
    holdings.reduce((prev, next, index) => {
        const request = () => {
            return requestDownloadQuotes(next)
            .then(quotes => dispatch(receiveQuotes(quotes)))
            .catch(log.error);
        };
        if (!index) {
            return prev.then(request);
        }
        return prev.delay(1000).then(request);
    }, Promise.resolve());
};
