import * as types from '../constants/actionTypes';
import $ from 'jquery';

import { makeUrl, errorHandler } from '../utils';
export const requestSymbols = () => ({
    type: types.REQUEST_SYMBOLS
});

export const receiveSymbols = (symbols, query) => ({
    type: types.RECEIVE_SYMBOLS,
    receivedAt: Date.now(),
    symbols,
    query
});

/**
 * Available urls
 * http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=zpr&region=1&lang=en&callback=YAHOO.Finance.SymbolSuggest.ssCallback
 * https://s.yimg.com/aq/autoc?query=ZPR&region=US&lang=en-US&callback=YAHOO.util.UHScriptNodeDataSource.callbacks
 * http://autoc.finance.yahoo.com/autoc?query=google&region=1&lang=en&callback=YAHOO.Finance.SymbolSuggest.ssCallback
 */
const makeSymbolUrl = input => {
    let url = 'https://autoc.finance.yahoo.com/autoc';
    let params = {
        query: input,
        region: 1,
        lang: 'en'
    };
    return makeUrl(url, params);
};

const processSymbols = data => {
    let symbols = [];
    if (data.ResultSet && Array.isArray(data.ResultSet.Result)) {
        symbols = data.ResultSet.Result;
    }
    return symbols;
};

/**
 * Sample result
 * xch: "NYQ"
 * exchDisp: "NYSE"
 * name: "Alleghany Corporation"
 * symbol: "Y"
 * type: "S"
 * typeDisp: "Equity"
 * Problem encountered: 400 Bad request.
 * Solution: use
 * <!--no referer is used to cope 400 bad request error for SYMBOL auto complete API calls-->
 * <!--Reference: http://stackoverflow.com/questions/37094571/getting-400-bad-request-when-making-jsonp-request-to-yahoo-finance-api?answertab=votes#tab-top -->
 * <meta charset="UTF-8" name="referrer" content="no-referrer">
 */
export const fetchSymbols = input => dispatch => {
    if (!input) {
        // empty input, skip fetching
        return Promise.reject("Empty symbols, skip fetching");
    }
    dispatch(requestSymbols());
    return $.ajax({
        TYPE: 'GET',
        url: makeSymbolUrl(input),
        cache: true,
        dataType: 'jsonp',
        jsonp: 'callback',
    }).then(data => {
        let symbols = processSymbols(data);
        dispatch(receiveSymbols(symbols, input));
        return symbols;
    })
    .catch(errorHandler);
};