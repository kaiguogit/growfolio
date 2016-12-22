import {API} from '../services/api';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Reload} from '../messages';
import {bindable, bindingMode} from 'aurelia-framework';

export class TransactionForm {
    static inject = [API, EventAggregator];
    types = ['buy', 'sell'];

    @bindable({defaultBindingMode: bindingMode.twoWay}) opened;
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
        this.api.createTransaction(temp).then(transaction => {
            this.ea.publish(new Reload());
            this.opened = false;
            this.transaction = {};
        });
    }
}