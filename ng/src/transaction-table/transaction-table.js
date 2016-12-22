import {API} from '../services/api';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DeleteTransaction, Reload} from '../messages';

export class TransactionTable {
    static inject = [API, EventAggregator];

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
        this.api.getTransactions()
        .then(transactions => this.transactions = transactions);
    }

    _subscriptEvents() {
        this.ea.subscribe(Reload, msg => this.load());
        this.ea.subscribe(DeleteTransaction, msg => this.deleteTransaction());
    }

    rowSelected(trsc) {
        this.transactions.forEach(x => x.isSelected = false);
        trsc.isSelected = true;
    }

    deleteTransaction() {
        let selectedTransaction = this.transactions.find(x => x.isSelected);

        if (!selectedTransaction) return;

        this.api.deleteTransaction(selectedTransaction)
        .then(() => {
            this.ea.publish(new Reload());
        });
    }
}