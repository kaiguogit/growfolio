import {Transaction, DollarValue, DollarValueMap} from './transaction';
import { round, divide } from '../utils';

const HOLDING_PROPERTIES = {
    shares: DollarValue,
    cost: DollarValue,
    averageCost: DollarValue,
    realizedGain: DollarValue,
    realizedGainYearly: DollarValueMap,
    capitalGainYearly: DollarValueMap,
    dividend: DollarValue,
    dividendYearly: DollarValueMap
};

const CASH_PROPERTIES = {
    total: DollarValue
};

const compareDate = (a, b) => {
    return new Date(a.date) - new Date(b.date);
};

export class Account {
    /**
     * @param {array} data.tscs
     * @param {number} data.exchangeRates
     */
    constructor(params) {
        this.holdings = [];
        this.transactions = [];
        this.cash = DollarValue.TYPES.reduce((result, currency) => {
            result[currency] = new Cash({currency});
            return result;
        }, {});
        if (params) {
            this.init(params);
        }
    }

    init({tscs, exchangeRates}) {
        if (!(tscs && exchangeRates)) {
            return;
        }
        // TODO verify tscs by date. Such as whether there is enough shares to
        // sell
        tscs.forEach(tsc => {
            // new object
            tsc = new Transaction(tsc, exchangeRates);
            // Create holding and add tsc to it.
            if (tsc.isCash) {
                let cash = this.cash[tsc.currency];
                if (!cash) {
                    cash = this.cash[tsc.currency] = new Cash({currency: tsc.currency});
                }
                cash.transactions.push(tsc);
            } else {
                let holding = this.holdings.find(x => x.symbol === tsc.symbol);
                if (!holding) {
                    holding = new Holding({
                        name: tsc.name,
                        symbol: tsc.symbol,
                        currency: tsc.currency,
                        exch: tsc.exch,
                    });
                    this.holdings.push(holding);
                }
                holding.transactions.push(tsc);
            }
            this.transactions.push(tsc);
        });

        this.transactions.sort(compareDate);
        Object.values(this.cash).forEach(cash => {
            cash.calculate();
            cash.transactions.sort(compareDate);
        });
        this.holdings.forEach(holding => {
            holding.transactions.sort(compareDate);
            holding.calculate(this.cash);
        });
    }

    getCashTransactions(startDate, endDate) {
        const result = Object.values(this.cash).reduce((acc, cash) => {
            return acc.concat(cash.getValidTscs(startDate, endDate));
        }, []);
        result.sort(compareDate);
        return result;
    }
}

class Base {
    constructor() {
        this.transactions = [];
    }
    getValidTscs(startDate, endDate, typeFilter) {
        return this.transactions.filter(tsc => tsc.isValid(startDate, endDate, typeFilter));
    }
    hasValidTscs(startDate, endDate, typeFilter) {
        return this.getValidTscs(startDate, endDate, typeFilter).length;
    }
}

export class Cash extends Base {
    /**
     * @param {string} data.currency
     */
    constructor(data) {
        super();
        this.currency = data.currency.toUpperCase();
        this.transactions = [];
        Object.entries(CASH_PROPERTIES).forEach(([key, valueClass]) => {
            this[key] = new valueClass();
        });
    }
    calculate() {
        this.transactions.forEach(tsc => {
            let {type, total, unfoundRate, currency} = tsc;
            if (tsc.currency !== currency) {
                return;
            }
            this.unfoundRate = this.unfoundRate || unfoundRate;
            if (type === 'deposit') {
                this.total[currency] += total[currency];
            } else if (type === 'withdraw') {
                this.total[currency] -= total[currency];
            }
        });
    }
    clone() {
        let cloned = new Cash(this);
        cloned.unfoundRate = this.unfoundRate;
        cloned.transactions = cloned.transactions.concat(this.transactions);
        return cloned;
    }
}

Cash.CASH_PROPERTIES = CASH_PROPERTIES;

export class Holding extends Base {
    /**
     * @param {string} data.symbol
     * @param {string} data.exch
     * @param {string} data.name
     * @param {string} data.currency
     */
    constructor(data) {
        super();
        const {symbol, exch, name, currency} = data;
        Object.assign(this, {symbol, exch, name, currency});
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
     *     shares (current holding cost),
     *     realizedGain (sold value - holding cost * (sold shares / holding shares))
    */
    calculate(cashes) {
        // Assuming the transactions here are already sorted by date.
        DollarValue.TYPES.forEach(currency => {
            this.transactions.forEach(tsc => {
                let {type, acbChange, total, shares, deductFromCash, realizedGain, returnOfCapital, capitalGain,
                    newAcb, newAverageCost, unfoundRate, date} = tsc;
                this.unfoundRate = this.unfoundRate || unfoundRate;
                const cash = currency === tsc.currency ? cashes[currency] : null;
                const year = date.year();
                // http://www.moneysense.ca/invest/calculating-capital-gains-on-u-s-stocks/
                // Keep track of CAD based ACB.
                // You need to determine the cost in Canadian dollars
                // based on the exchange rate at the time of purchase and do the same for the sale proceeds
                // based on the current exchange rate.
                if (type === 'buy') {
                    acbChange[currency] = total[currency];
                    if (cash && deductFromCash) {
                        cash.total[currency] -= total[currency];
                    }
                    this.shares[currency] += shares;
                } else if (type === 'sell') {
                    // acb change is cost * (sold shares / holding shares)
                    acbChange[currency] = - divide(this.cost[currency] * shares, this.shares[currency]);
                    realizedGain[currency] = total[currency] + acbChange[currency];
                    this.realizedGain[currency] += realizedGain[currency];
                    this.realizedGainYearly.addValue(year, realizedGain[currency], currency);
                    this.capitalGainYearly.addValue(year, realizedGain[currency], currency);
                    this.shares[currency] -= shares;
                    if (cash && deductFromCash) {
                        cash.total[currency] += total[currency];
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
                    realizedGain[currency] = total[currency];
                    if (cash && deductFromCash) {
                        cash.total[currency] += total[currency];
                    }
                    this.realizedGain[currency] += realizedGain[currency];
                    this.realizedGainYearly.addValue(year, realizedGain[currency], currency);
                    this.dividend[currency] += realizedGain[currency];
                    this.dividendYearly.addValue(year, realizedGain[currency], currency);
                } else {
                    // There shouldn't be anything else. But return just in case.
                    // Deposit and Withdraw type should be in Cash class.
                    return;
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
        cloned.transactions = cloned.transactions.concat(this.transactions);
        return cloned;
    }
}

Holding.HOLDING_PROPERTIES = HOLDING_PROPERTIES;