import {WebAPI} from '../web-api';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TransactionAdded} from '../messages';

export class TransactionForm {
    static inject = [WebAPI, EventAggregator];
    types = ['buy', 'sell'];

    constructor(api, ea) {
        this.api = api;
        this.ea = ea;
        this.transaction = {type: 'buy'}
    }

    save() {
        debugger;
    }

    get canSave() {
        return this.transaction.symbol;
    }

    save() {
        let temp = JSON.parse(JSON.stringify(this.transaction))
        temp.date = new Date(temp.date);
        this.api.saveTransaction(temp).then(transaction => {
            this.ea.publish(new TransactionAdded(transaction));
            this.transaction = {};
        });
    }
}