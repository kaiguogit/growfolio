import { divide } from '../utils';
import moment from 'moment';

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
    }
}

export default Transaction;