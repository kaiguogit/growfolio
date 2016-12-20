import {WebAPI} from '../web-api';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TransactionAdded} from '../messages';

export class TransactionTable {
    static inject = [WebAPI, EventAggregator];

    constructor(api, ea) {
        this.api = api;
        this.ea = ea;
        this._subscriptEvents();
        this.transactions = [];
    }

    created() {
        this.load();
    }

    load() {
        this.api.getTransactionList()
        .then(transactions => this.transactions = transactions);
    }

    _subscriptEvents() {
        this.ea.subscribe(TransactionAdded, msg => this.load());
    }
}