import {createSelector, registerSelectors} from './selectorsUtils';
import moment from 'moment-timezone';
window.moment = moment;
import { divide } from '../utils';

export const getQuotes = state => state.quotes.data;
export const getQuote = (state, props) => state.quotes.data[props.symbol];
export const getQuotesMeta = state => state.quotes.meta;
export const getQuoteMeta = (state, props) => state.quotes.meta[props.symbol];

const DATE_FORMAT = 'YYYY-MM-DD';
const NEW_YORK_TIME_ZONE = 'America/New_York';

const parseDate = (date) => {
    if (!date) {
        return moment.tz(NEW_YORK_TIME_ZONE);
    }
    return moment.tz(date, NEW_YORK_TIME_ZONE);
};

/**
 * Get previous date string
 * @param date string format date 'YYYY-MM-DD', if not privoded, use today.
 * @return previous day's string format
 */
const previousDateStr = date => {
    if (!date) {
        return parseDate().format(DATE_FORMAT);
    }
    return parseDate(date).subtract(1, 'days').format(DATE_FORMAT);
};

/**
 * Get quote before date
 * @param quotes quotes map
 * @param date specific date, if not provided, use today
 */
const _findLatestQuote = (quotes, date) => {
    if (quotes) {
        const maxLength = Object.keys(quotes).length;
        let count = 0;
        date = date || previousDateStr();
        while (!quotes[date] && count < maxLength) {
            date = previousDateStr(date);
            count++;
        }
        return {
            date,
            quote: quotes[date]
        };
    }
    return {};
};

const calculateQuote = (data, meta) => {
    let lastIntraday = meta && meta.lastRefreshedIntraday;
    lastIntraday = data && data[lastIntraday] && lastIntraday;
    let lastDaily = meta && meta.lastRefreshedDaily;
    lastDaily = data && data[lastDaily] && lastDaily;
    let keyToUse = lastIntraday || lastDaily;
    if (lastIntraday && lastDaily) {
        keyToUse = parseDate(lastIntraday).isAfter(parseDate(lastDaily)) ? lastIntraday : lastDaily;
    }
    if (keyToUse) {
        const {date: latestDate, quote: latestQuote} = _findLatestQuote(data, keyToUse);
        if (latestDate) {
            const {quote: previousQuote} = _findLatestQuote(data, previousDateStr(latestDate));
            return _calculateChange(latestQuote, previousQuote);
        }
        return Object.assign({}, latestQuote);
    }
};

export const getLatestQuote = createSelector([getQuote, getQuoteMeta], calculateQuote);
registerSelectors({getLatestQuote});

export const getLatestQuotes = createSelector([getQuotes, getQuotesMeta], (data, meta) => {
    return Object.keys(data).reduce((result, symbol) => {
        result[symbol] = calculateQuote(data[symbol], meta[symbol]);
        return result;
    }, {});
});

/**
 * Compare 2 days' quotes to calculate change and changePercent
 * @param latestQuote
 * @param previousQuote
 * @return quote with additional change and changePercent property
 */
const _calculateChange = (latestQuote, previousQuote) => {
    const result = Object.assign({}, latestQuote);
    if (latestQuote && previousQuote) {
        let latestClose = latestQuote.close;
        let previousClose = previousQuote.close;
        result.change = latestClose - previousClose;
        result.changePercent = divide((latestClose - previousClose), previousClose);
    }
    return result;
};
registerSelectors({getLatestQuote});
