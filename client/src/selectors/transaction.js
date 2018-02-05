import { divide } from '../utils';
import moment from 'moment';
import historicalDailyExchangeRate from '../constants/dailyExchangeRate';

const _getHistoricalDailyRate = (date) => {
    return historicalDailyExchangeRate && historicalDailyExchangeRate.observations &&
        historicalDailyExchangeRate.observations[date];
};

class Transaction {
    constructor(data) {
        Object.assign(this, data);
        this.init();
    }

    init() {
        const {type, totalOrPerShare, amount, shares, commission} = this;

        // Amount could be total or price based on totalOrPerShare property.
        // Calculate total and price
        if (type === 'buy' || type === 'dividend') {
            this.total = totalOrPerShare ? amount :
                (shares * amount + commission);
            this.price = totalOrPerShare ?
                divide(amount - commission, shares) :
                amount;
        }
        if (type === 'sell') {
            this.total = totalOrPerShare ? amount :
                (shares * amount - commission);
            this.price = totalOrPerShare ?
                divide(amount + commission, shares) :
                amount;
        }
        this.currency = this.currency.toUpperCase();
        this.date = moment(this.date);

        if (this.currency === 'USD') {
            this.findRate();
        }
    }

    findRate() {
        this.rate = _getHistoricalDailyRate(this.date.format('YYYY-MM-DD'));
    }
}

export default Transaction;