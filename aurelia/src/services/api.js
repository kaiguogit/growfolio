// polyfills
import 'whatwg-fetch';
import {HttpClient, json} from 'aurelia-fetch-client';

let client = new HttpClient();
const BASE_URI = "http://localhost:3000/api/"

function errorHandler(error) {
    console.log(error);
}

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
                console.log("quote is", data);
                let result = data.query.results.quote;
                //always return an Array.
                return Array.isArray(result) ? result : [result];
            });
    }

    getTransactions() {
        // Optional mode: no-cors
        // return this.client.fetch(BASE_URI + "transactions", {mode: "no-cors"})
        return this.client.fetch(BASE_URI + "transactions")
            .then(response => response.json())
            .then(data => {
                return data.result;
            })
            .catch(errorHandler);
    }

    createTransaction(trsc) {
        return this.client.fetch(BASE_URI + "transactions", {
                method: 'post',
                body: json(trsc)
            })
            .then(response => response.json())
            .then(data => {
                return data.result;
            })
            .catch(errorHandler);
    }

    deleteTransaction(trsc) {
        return this.client.fetch(BASE_URI + "transactions", {
                method: 'delete',
                body: json({id: trsc._id})
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.result.message);
                return data.result;
            })
            .catch(errorHandler);
    }
}