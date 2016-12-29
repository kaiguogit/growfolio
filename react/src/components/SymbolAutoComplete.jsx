import React, { PropTypes } from 'react';
import Select from 'react-select';

import { makeUrl, errorHandler } from '../utils';
import $ from 'jquery';

/**
 * Available urls
 * http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=zpr&region=1&lang=en&callback=YAHOO.Finance.SymbolSuggest.ssCallback
 * https://s.yimg.com/aq/autoc?query=ZPR&region=US&lang=en-US&callback=YAHOO.util.UHScriptNodeDataSource.callbacks
 * http://autoc.finance.yahoo.com/autoc?query=google&region=1&lang=en&callback=YAHOO.Finance.SymbolSuggest.ssCallback
 */
const makeSymbolUrl = input => {
    let url = 'http://d.yimg.com/autoc.finance.yahoo.com/autoc';
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
 */
const fetchSymbols = input => {
    if (!input) {
        // empty input, skip fetching
        return Promise.reject("Empty symbols, skip fetching");
    }
    return $.ajax({
        TYPE: 'GET',
        url: makeSymbolUrl(input),
        cache: true,
        dataType: 'jsonp',
        jsonp: 'callback',
    }).then(data => processSymbols(data))
    .catch(errorHandler);
};

class SymbolAutoComplete extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired
    }

    renderValue = option => {
        return <div>{`${option.exchDisp}:${option.value}`}</div>;
    }

    selectSymbolSearch = input => {
        return fetchSymbols(input).then(data=>{
            let result = {};
            result = {
                options: data.map(symbol => {
                    // xch: "NYQ"
                    // exchDisp: "NYSE"
                    // name: "Alleghany Corporation"
                    // symbol: "Y"
                    return {
                        //Remove symbol suffix, e.g ZPR.TO -> ZPR
                        value: symbol.symbol.replace(/\..*/, ''),
                        label: `${symbol.symbol}     ${symbol.name}       ${symbol.exchDisp}`,
                        exchDisp: symbol.exchDisp,
                        name: symbol.name
                    };
                })
            };
            return result;
        });
    }

    render() {
        return(
            <Select.Async
                value={this.props.value}
                onChange={this.props.onChange}
                loadOptions={this.selectSymbolSearch}
                valueRenderer={this.renderValue}
            />
        );
    }
}

export default SymbolAutoComplete;