import {EventAggregator} from 'aurelia-event-aggregator';
import {DeleteTransaction} from '../messages';

const TRSC = "transactions";
const PERF = "performance";

export class Portfolio {
    static inject = [EventAggregator];

    constructor(ea) {
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
    }

    deleteTransaction() {
        this.ea.publish(new DeleteTransaction);
    }
}