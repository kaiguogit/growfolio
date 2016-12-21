import {WebAPI} from '../web-api';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TransactionAdded, DeleteTransaction} from '../messages';

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
        this.ea.subscribe(DeleteTransaction, msg => this.deleteTransaction());
    }

    rowSelected(trsc) {
        this.transactions.forEach(x => x.isSelected = false);
        trsc.isSelected = true;
    }

    deleteTransaction() {
        let selectedTransaction = this.transactions.find(x => x.isSelected);
        this.api.deleteTransaction(selectedTransaction).then(() => this.load());
    }
}