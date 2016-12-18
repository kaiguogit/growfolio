// polyfills
import 'whatwg-fetch';
import Promise from 'promise-polyfill';

import {HttpClient} from 'aurelia-fetch-client';

let client = new HttpClient();

export class API {
    constructor(client) {
        this.client = client;
    }

    getQuotes() {
        this.client.fetch()
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
    }
}