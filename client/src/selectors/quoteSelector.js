import {createSelector, registerSelectors} from './selectorsUtils';
import moment from 'moment';
window.moment = moment;
import { divide } from '../utils';

export const getQuotes = state => state.quotes.data;
export const getQuote = (state, props) => state.quotes.data[props.symbol];
export const getQuotesMeta = state => state.quotes.meta;
export const getQuoteMeta = (state, props) => state.quotes.meta[props.symbol];

const DATE_FORMAT = 'YYYY-MM-DD';

const calculateQuote = (data, meta) => {
    let lastRefreshedIntraday = meta && meta.lastRefreshedIntraday;
    // let lastRefreshedDaily = meta && meta.lastRefreshedDaily;
    if (lastRefreshedIntraday) {
        const {date: latestDate, quote: latestQuote} = _findLatestQuote(data, lastRefreshedIntraday);
        if (latestDate) {
            const {quote: previousQuote} = _findLatestQuote(data, previousDateStr(latestDate));
            return _calculateChange(latestQuote, previousQuote);
        }
    }
};

export const getLatestQuote = createSelector([getQuote, getQuoteMeta], calculateQuote);
registerSelectors({getLatestQuote});

export const getLatestQuotes = createSelector([getQuotes, getQuotesMeta], (data, meta) => {
    return Object.keys(data).reduce((result, symbol) => {
        result[symbol] = calculateQuote(data[symbol, meta[symbol]]);
        return result;
    }, {});
});

/**
 * Get previous date string
 * @param date string format date 'YYYY-MM-DD', if not privoded, use today.
 * @return previous day's string format
 */
const previousDateStr = (date) => {
    if (!date) {
        return moment().format(DATE_FORMAT);
    }
    date = moment(date, DATE_FORMAT).subtract(1, 'days');
    return date.format(DATE_FORMAT);
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

/**
 * Compare 2 days' quotes to calculate change and changePercent
 * @param latestQuote
 * @param previousQuote
 * @return quote with additional change and changePercent property
 */
const _calculateChange = (latestQuote, previousQuote) => {
    if (latestQuote && previousQuote) {
        const result = {};
        Object.assign(result, latestQuote);
        let latestClose = latestQuote.close;
        let previousClose = previousQuote.close;
        result.change = latestClose - previousClose;
        result.changePercent = divide((latestClose - previousClose), previousClose);
        return result;
    }
    return latestQuote;
};
registerSelectors({getLatestQuote});
