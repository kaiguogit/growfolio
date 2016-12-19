// polyfills
import 'whatwg-fetch';
import {HttpClient} from 'aurelia-fetch-client';

let client = new HttpClient();

function queryParams(params) {
    let esc = encodeURIComponent;
    return Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');

}

function makeUrl(url, params) {
    return url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(params);
}

export class API {
    constructor() {
        this.client = client;
    }

    getQuotes(symbols) {
        // concat symbols into \"YAHOO\",\"GOOGL\",\"AMZN\"
        let symbolsStr = symbols.map((symbol) => '\"' + symbol + '\"').join(',')

        let url = 'https://query.yahooapis.com/v1/public/yql';
        let params = {
          q: `select * from yahoo.finance.quotes where symbol in (${symbolsStr})`,
          format:'json',
          diagnostics: 'true',
          env: 'store://datatables.org/alltableswithkeys',
          callback: ''
        }
        return this.client.fetch(makeUrl(url, params))
            .then(response => response.json())
            .then(data => {
                let result = data.query.results.quote;
                //always return an Array.
                return Array.isArray(result) ? result : [result];
            })
    }
}