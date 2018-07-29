import { divide } from '../utils';
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

    processInitialData() {
        this.currency = this.currency.toUpperCase();
        this.date = moment(this.date);
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
            }
            if (type === 'sell') {
                this.total[currency] = totalOrPerShare ? amount :
                    (shares * amount - commission);
                this.price[currency] = totalOrPerShare ?
                    divide(amount + commission, shares) :
                    amount;
            }
        });
    }
}

export class DollarValue {
    constructor(params = {}) {
        let {CAD, USD} = params;
        this.CAD = CAD || 0;
        this.USD = USD || 0;
    }
}

DollarValue.TYPES = ['CAD', 'USD'];
