import * as types from '../constants/actionTypes';

export const requestQuotes = () => ({
    type: types.REQUEST_QUOTES
});

export const receiveQuotes = (quotes) => ({
    type: types.RECEIVE_QUOTES,
    receivedAt: Date.now(),
    quotes
});

const errorHandler = error => {
    console.log(error);
};

const queryParams = (params) => {
    let esc = encodeURIComponent;
    return Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');

};

const makeUrl = (url, params) => {
    return url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(params);
};

const makeQuotesUrl = symbols => {
    // concat symbols into \"YAHOO\",\"GOOGL\",\"AMZN\"
    let symbolsStr = symbols.map((symbol) => '\"' + symbol + '\"').join(',');
    let url = 'https://query.yahooapis.com/v1/public/yql';
    let params = {
      q: `select * from yahoo.finance.quotes where symbol in (${symbolsStr})`,
      format:'json',
      diagnostics: 'true',
      env: 'store://datatables.org/alltableswithkeys',
      callback: ''
    };
    return makeUrl(url, params);
};

/*
 * Async Actions
 * Return a function that takes dispatch, fed by React Thunk middleware
 */
export const fetchQuotes = symbols => dispatch => {
    if (!(symbols && Array.isArray(symbols) && symbols.length)) {
        // console.log("empty symbols, skip fetching");
        // empty symbols, skip fetching
        return;
    }
    dispatch(requestQuotes());
    return fetch(makeQuotesUrl(symbols))
        .then(response => response.json())
        .then(data => {
            let quotes = data.query.results.quote;
            console.log("quotes is", quotes);
            // always return an Array.
            quotes = Array.isArray(quotes) ? quotes : [quotes];
            // convert to object map
            let result = {};
            quotes.forEach(quote => {
                result[quote.symbol] = quote;
            });
            dispatch(receiveQuotes(result));
        })
        .catch(errorHandler);
};