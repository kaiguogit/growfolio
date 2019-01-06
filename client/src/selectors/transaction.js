import { divide, avoidNaN } from '../utils';
import moment from 'moment-timezone';

export class Transaction {
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
    constructor(data, exchangeRates) {
        Object.assign(this, data);
        this.processInitialData();
        this.setRate(exchangeRates);
        this.setDollarValues();
        this.setTotalandPrice();
    }

    processInitialData() {
        this.currency = this.currency.toUpperCase();
        this.date = moment(this.date);
        if (this.type === 'withdraw' || this.type === 'deposit') {
            this.symbol = 'cash';
            this.isCash = true;
        } else {
            this.isCash = false;
        }
    }

    setDollarValues() {
        let rate = this.isUSD() ? this.rate : divide(1, this.rate);
        let CADValue, USDValue;
        ['amount', 'commission', 'returnOfCapital', 'capitalGain'].forEach(key => {
            CADValue = this.isUSD() ? this[key] * rate : this[key];
            USDValue = this.isUSD() ? this[key] : this[key] * rate;
            this[key] = new DollarValue({CAD: CADValue, USD: USDValue});
        });
        ['acbChange', 'realizedGain', 'newAcb', 'newAverageCost'].forEach(key => {
            this[key] = new DollarValue();
        });
    }

    setRate(exchangeRates) {
        this.rate = exchangeRates[this.date.format('YYYY-MM-DD')];
        if (!this.rate) {
            this.rate = 1;
            this.unfoundRate = true;
        }
    }

    isUSD() {
        return this.currency === 'USD';
    }

    isValid(startDate, endDate) {
        return (this.date.isBefore(endDate, 'day') || this.date.isSame(endDate, 'day')) &&
        (this.date.isAfter(startDate, 'day') || this.date.isSame(startDate, 'day'));
    }

    setTotalandPrice() {
        const {type, totalOrPerShare, shares} = this;
        this.total = new DollarValue();
        this.price = new DollarValue();
        DollarValue.TYPES.forEach(currency => {
            let amount = this.amount[currency];
            let commission = this.commission[currency];
            // Amount could be total or price based on totalOrPerShare property.
            // Calculate total and price
            if (type === 'buy' || type === 'dividend') {
                this.total[currency] = totalOrPerShare ? amount :
                    (shares * amount + commission);
                this.price[currency] = totalOrPerShare ?
                    divide(amount - commission, shares) :
                    amount;
            } else if (type === 'sell') {
                this.total[currency] = totalOrPerShare ? amount :
                    (shares * amount - commission);
                this.price[currency] = totalOrPerShare ?
                    divide(amount + commission, shares) :
                    amount;
            } else if (this.isCash) {
                this.total[currency] = amount;
            }
        });
    }
}

export class DollarValue {
    constructor(anotherDollorValue = {}) {
        this.add(anotherDollorValue);
    }
    add(anotherDollorValue) {
        if (!anotherDollorValue) {
            throw new Error('anotherDollorValue is empty in DollarValue.add');
        }
        DollarValue.TYPES.forEach(currency => {
            this[currency] = this[currency] || 0;
            this[currency] += (anotherDollorValue[currency] || 0);
        });
    }
    clone() {
        return new DollarValue(this);
    }
    avoidNaN() {
        DollarValue.TYPES.forEach(type => {
            avoidNaN(type, this);
        });
    }
}

DollarValue.TYPES = ['CAD', 'USD'];

export class DollarValueMap {
    constructor(anotherDollorValueMap = {map: {}}) {
        this.map = {};
        this.add(anotherDollorValueMap);
    }
    add(anotherDollorValueMap) {
        if (!anotherDollorValueMap || !anotherDollorValueMap.map) {
            throw new Error('anotherDollorValueMap is empty in DollarValueMap.add');
        }
        Object.entries(anotherDollorValueMap.map).forEach(([key, value]) => {
            if (this.map[key]) {
                this.map[key].add(value);
            } else {
                this.map[key] = value.clone();
            }
        });
    }
    addValue(key, value, currency) {
        if (this.map[key]) {
            this.map[key][currency] += value;
        } else {
            this.map[key] = new DollarValue({[currency]: value});
        }
    }
    get(key) {
        return this.map[key];
    }
    avoidNaN() {
        Object.values(this.map).forEach(value => value.avoidNaN());
    }
    clone() {
        return new DollarValueMap(this);
    }
}

