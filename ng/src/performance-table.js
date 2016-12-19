import {HoldingService} from './services/holding-service';

const REFRESH_INTERVAL = 10000;
const UP = "up";
const DOWN = "down";

export class PerformanceTable {
    static inject = [HoldingService];

    constructor(holdingService) {
        this.holdingService = holdingService;
        this.holdingService.init().then(() => {
            this.holdings = this.holdingService.holdings;
        });
        setInterval(() => this.holdingService.refresh(), REFRESH_INTERVAL);

    }
    numberColor(number) {
        if (number > 0) {
            return UP;
        }
        if (number < 0) {
            return DOWN;
        }
        return '';
    }
}