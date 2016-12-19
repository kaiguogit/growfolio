import {WebAPI} from './web-api';

const TRSC = "transactions";
const PERF = "performance";

export class Portfolio {
    static inject = [WebAPI];

    constructor(api) {
        this.api = api;
        this.name = "Portfolio1";
        this.currentTable = PERF;
        this.tables = [PERF, TRSC];
    }

    selectTable(table) {
        this.currentTable = table;
    }
}