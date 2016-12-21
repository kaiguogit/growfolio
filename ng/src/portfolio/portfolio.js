import {WebAPI} from '../web-api';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TransactionAdded, DeleteTransaction} from '../messages';

const TRSC = "transactions";
const PERF = "performance";

export class Portfolio {
    static inject = [WebAPI, EventAggregator];

    constructor(api, ea) {
        this.api = api;
        this.ea = ea;
        this._subscriptEvents();
        this.name = "Portfolio1";
        this.currentTable = PERF;
        this.tables = [PERF, TRSC];
        this.transactionFormOpened = false;
    }

    selectTable(table) {
        this.currentTable = table;
    }

    toggleTransactionForm() {
        this.transactionFormOpened = !this.transactionFormOpened;
    }

    _subscriptEvents() {
        this.ea.subscribe(TransactionAdded, () => this.transactionFormOpened = false);
    }

    deleteTransaction() {
        this.ea.publish(new DeleteTransaction);
    }
}