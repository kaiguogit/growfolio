import { divide } from '../utils';
import moment from 'moment';
import historicalDailyExchangeRate from '../constants/dailyExchangeRate';

const _getHistoricalDailyRate = date => {
    return historicalDailyExchangeRate && historicalDailyExchangeRate.observations &&
        historicalDailyExchangeRate.observations[date];
};

class Transaction {
    /**
     * @param {string} data.symbol
     * @param {string} data.exch
     * @param {string} data.name
     * @param {date} data.date
     * @param {string} data.currency
     * @param {string} data.account
     * @param {string} data.type
     * @param {boolean} data.totalOrPerShare
     * @param {number} data.amount
     * @param {number} data.shares
     * @param {number} data.commission
     * returnofCapital decrease the acb.
     * @param {number} data.returnOfCapital
     * capital gain portion of dividend, not the realized gain. It increases the acb.
     * @param {number} data.capitalGain
     * @param {string} data.note
     */
    constructor(data) {
        this.original = data;
        this.processInitialData();
        this._id = this.original._id;
        this.symbol = this.original.symbol;
        this.type = this.original.type;
        this.account = this.original.account;
        this.currency = this.original.currency;
        this.date = this.original.date;
        this.CAD = null;
        this.USD = null;
        this.calculate();
    }

    processInitialData() {
        this.original.currency = this.original.currency.toUpperCase();
        this.original.date = moment(this.original.date);
    }

    calculate() {
        this.setRate();
        let params = {
            CAD: {},
            USD: {}
        };
        this.data = {};
        ['CAD', 'USD'].forEach(currency => {
            ['symbol', 'exch', 'name', 'date', 'currency', 'account', 'type', 'totalOrPerShare', 'shares', 'note'].forEach(key => {
                params[currency][key] = this.original[key];
            });
        });
        let otherCurrency = this.isUSD() ? 'CAD' : 'USD';
        let rate = this.isUSD() ? this.rate : divide(1, this.rate);
        ['amount', 'commission', 'returnOfCapital', 'capitalGain'].forEach(key => {
            params[this.currency][key] = this.original[key];
            params[otherCurrency][key] = this.original[key] * rate;
        });
        Object.keys(params).forEach(currency => {
            this[currency] = new TransactionData(params[currency]);
        });
    }

    setRate() {
        if (this.isUSD()) {
            this.rate = _getHistoricalDailyRate(this.date.format('YYYY-MM-DD'));
            if (!this.rate) {
                this.rate = 1;
                this.unfoundRate = true;
            }
        }
    }

    isUSD() {
        return this.currency === 'USD';
    }
}

export default Transaction;

class TransactionData {
    /**
     * @param {boolean} data.totalOrPerShare
     * @param {number} data.amount
     * @param {number} data.shares
     * @param {number} data.commission
     * returnofCapital decrease the acb.
     * @param {number} data.returnOfCapital
     * capital gain portion of dividend, not the realized gain. It increases the acb.
     * @param {number} data.capitalGain
     */
    constructor(data) {
        Object.assign(this, data);
        this.setTotalandPrice();
    }

    setTotalandPrice() {
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
    }
}