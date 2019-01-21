import {DollarValue, DollarValueMap} from './transaction';
import { round, divide } from '../utils';

const HOLDING_PROPERTIES = {
    'shares': DollarValue,
    'cost': DollarValue,
    'costOverall': DollarValue,
    'averageCost': DollarValue,
    'realizedGain': DollarValue,
    'realizedGainYearly': DollarValueMap,
    'capitalGainYearly': DollarValueMap,
    'dividend': DollarValue,
    'dividendYearly': DollarValueMap
};

const TSCS_PROPERTIES = [
    'transactions',
    'buyTransactions',
    'sellTransactions'
];

class Holding {
    /**
     * @param {string} data.symbol
     * @param {string} data.exch
     * @param {string} data.name
     * @param {string} data.currency
     */
    constructor(data) {
        const {symbol, exch, name, currency} = data;
        Object.assign(this, {symbol, exch, name, currency});
        this.init();
    }

    init() {
        this.transactions = [];
        this.sellTransactions = [];
        this.buyTransactions = [];
        this.dividendTransactions = [];
        Object.entries(HOLDING_PROPERTIES).forEach(([key, valueClass]) => {
            this[key] = new valueClass();
        });
    }

    /**
     * Calculate the cost of holding for specified symbol based on transcations.
     * Add keys: shares, cost.
     * @param {object} holding: The holding for specified symbol
     * @return holding with calculated
     *     cost (current holding cost),
     *     averageCost (current holding's cost per share),
     *     costOverall (accumulated buying cost),
     *     shares (current holding cost),
     *     realizedGain (sold value - holding cost * (sold shares / holding shares))
    */
    calculate() {
        // Assuming the transactions here are already sorted by date.
        DollarValue.TYPES.forEach(currency => {
            this.transactions.forEach(tsc => {
                let {type, acbChange, total, shares, realizedGain, returnOfCapital, capitalGain,
                    newAcb, newAverageCost, unfoundRate, date} = tsc;
                this.unfoundRate = this.unfoundRate || unfoundRate;
                const year = date.year();
                // http://www.moneysense.ca/invest/calculating-capital-gains-on-u-s-stocks/
                // Keep track of CAD based ACB.
                // You need to determine the cost in Canadian dollars
                // based on the exchange rate at the time of purchase and do the same for the sale proceeds
                // based on the current exchange rate.
                if (type === 'buy' || type === 'sell') {
                    if (type === 'buy') {
                        acbChange[currency] = total[currency];
                        // Accumulate all buy cost or overall return.
                        this.costOverall[currency] += acbChange[currency];
                        this.shares[currency] += shares;
                    } else if (type === 'sell') {
                        // acb change is cost * (sold shares / holding shares)
                        acbChange[currency] = - divide(this.cost[currency] * shares, this.shares[currency]);
                        realizedGain[currency] = total[currency] + acbChange[currency];
                        this.realizedGain[currency] += realizedGain[currency];
                        this.realizedGainYearly.addValue(year, realizedGain[currency], currency);
                        this.capitalGainYearly.addValue(year, realizedGain[currency], currency);
                        this.shares[currency] -= shares;
                    }
                } else if (type === 'dividend') {
                    // http://canadianmoneyforum.com/showthread.php/10747-quot-Notional-distribution-quot-question
                    // Return of capital decrease cost
                    if (returnOfCapital[currency]) {
                        acbChange[currency] = - returnOfCapital[currency];
                    }
                    // Capital gain is not distributed to me, they are reinvested inside of the fund
                    // Since I will pay tax on it, therefore it increases the cost
                    if (capitalGain[currency]) {
                        acbChange[currency] += capitalGain[currency];
                    }
                    // Accumulate all buy cost or overall return.
                    this.costOverall[currency] += acbChange[currency];
                    realizedGain[currency] = total[currency];
                    this.realizedGain[currency] += realizedGain[currency];
                    this.realizedGainYearly.addValue(year, realizedGain[currency], currency);
                    this.dividend[currency] += realizedGain[currency];
                    this.dividendYearly.addValue(year, realizedGain[currency], currency);
                }
                this.cost[currency] += acbChange[currency];
                acbChange[currency] = round(acbChange[currency], 3);
                // ACB status for tsc
                // Not sure why, but 774 * 47.19 + 9.95 = 36535.009999999995 instead of
                // 36536.01
                // so round last 3 digit for these properties
                if (this.shares[currency]) {
                    newAcb[currency] = round(this.cost[currency], 3);
                    newAverageCost[currency] = round(divide(this.cost[currency], this.shares[currency]), 3);
                } else {
                    newAcb[currency] = 0;
                    newAverageCost[currency] = 0;
                }
            });
            if (this.shares[currency]) {
                this.cost[currency] = round(this.cost[currency], 3);
            } else {
                // Clear cost if share is 0, since it maybe very small
                // number after minus sell transacations.
                this.cost[currency] = 0;
            }
            this.averageCost[currency] = divide(this.cost[currency], this.shares[currency]);
            this.avoidNaN();
        });
    }

    avoidNaN() {
        Object.keys(HOLDING_PROPERTIES).forEach(key => {
            this[key].avoidNaN();
        });
    }

    isUSD() {
        return this.currency === 'USD';
    }

    clone() {
        let cloned = new Holding(this);
        cloned.unfoundRate = this.unfoundRate;
        Object.keys(HOLDING_PROPERTIES).forEach(key => {
            cloned[key] = this[key].clone();
        });
        Holding.TSCS_PROPERTIES.forEach(key =>
            cloned[key] = cloned[key].concat(this[key])
        );
        return cloned;
    }
}

Holding.HOLDING_PROPERTIES = HOLDING_PROPERTIES;
Holding.TSCS_PROPERTIES = TSCS_PROPERTIES;

export default Holding;