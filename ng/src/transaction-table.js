import {WebAPI} from './web-api';

export class TransactionTable {
    static inject = [WebAPI];

    constructor(api) {
        this.api = api;
    }

    created() {
        this.api.getTransactionList()
        .then(transactions => this.transactions = transactions);
    }
}