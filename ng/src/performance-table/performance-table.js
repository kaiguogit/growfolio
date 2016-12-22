import {HoldingService} from '../services/holding-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Reload} from '../messages';

const REFRESH_INTERVAL = 10000;
const UP = "up";
const DOWN = "down";

export class PerformanceTable {
    static inject = [HoldingService, EventAggregator];

    constructor(holdingService, ea) {
        this.holdingService = holdingService;
        this.ea = ea;
        this.holdings = this.holdingService.holdings;
        this.holdingService.load();
        setInterval(() => this.holdingService.refresh(), REFRESH_INTERVAL);

        this._subscriptEvents();
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

    _subscriptEvents() {
        this.ea.subscribe(Reload, msg => this.holdingService.load());
    }
}