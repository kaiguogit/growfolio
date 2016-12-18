import {WebAPI} from './web-api';

const TRSC = "transactions";
const PERF = "performance";

export class Portfolio {
    static inject = [WebAPI];

    constructor(api) {
        this.api = api;
        this.name = "p1";
        this.currentTable = TRSC;
        this.tables = [TRSC, PERF];
    }

    selectTable(table) {
        this.currentTable = table;
    }
}