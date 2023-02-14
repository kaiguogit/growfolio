import {Transaction, DollarValue, DollarValueMap} from './transaction';
import { round, divide } from '../utils';
import moment from 'moment-timezone';

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

const compareDate = (a, b) => {
    if (a.date.isBefore(b.date, 'day')) {
        return -1;
    }
    if (a.date.isAfter(b.date, 'day')) {
        return 1;
    }
    return 0;
};

const compareTransactions = (a, b) => {
    const dateDiff = compareDate(a, b);
    if (dateDiff) {
        return dateDiff;
    }
    if (a.type === 'buy' && b.type === 'sell') {
        return -1;
    }
    if (a.type === 'sell' && b.type === 'buy') {
        return 1;
    }
    return 0;
};

const CURRENCY_MAP = {
    'DLR': 'CAD',
    'MSFT': 'USD'
};

export class Account {
    /**
     * @param {array} params.tscs
     * @param {number} params.exchangeRates
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
        const lastTscMap = {};
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
                    let currency = tsc.currency;
                    if (CURRENCY_MAP[tsc.symbol]) {
                        currency = CURRENCY_MAP[tsc.symbol];
                    }
                    holding = new Holding({
                        name: tsc.name,
                        symbol: tsc.symbol,
                        currency,
                        exch: tsc.exch,
                    });
                    this.holdings.push(holding);
                    lastTscMap[tsc.symbol] = tsc;
                }
                holding.transactions.push(tsc);
            }
            this.transactions.push(tsc);
        });

        this.transactions.sort(compareTransactions);
        this.holdings.forEach(holding => {
            holding.transactions.sort(compareTransactions);
            holding.calculate(this.cash);
        });
        Object.values(this.cash).forEach(cash => {
            cash.transactions.sort(compareTransactions);
            cash.calculate();
        });
    }

    getCashTransactions(startDate, endDate) {
        const result = Object.values(this.cash).reduce((acc, cash) => {
            return acc.concat(cash.getValidTscs(startDate, endDate));
        }, []);
        result.sort(compareTransactions);
        return result;
    }
    getValidTransactions(startDate, endDate, typeFilter) {
        return this.transactions.filter(tsc => tsc.isValid(startDate, endDate, typeFilter));
    }
    getAllTransactionsWithBalanceInBetween(startDate, endDate, typeFilter) {
        const result = [].concat(this.getValidTransactions(startDate, endDate, typeFilter));
        Object.values(this.cash).forEach(cash => {
            Object.values(cash.balance.data).forEach(yearData => {
                Object.values(yearData).forEach(balance => {
                    if (balance.isValid(startDate, endDate)) {
                        result.push(balance);
                    }
                });
            });
        });
        return result.sort((a, b) => {
            if (a instanceof Transaction && b instanceof Transaction) {
                return compareTransactions(a, b);
            }
            if (a instanceof Balance && b instanceof Balance) {
                if (a.year - b.year !== 0) {
                    return a.year - b.year;
                }
                if (a.month - b.month !== 0) {
                    return a.month - b.month;
                }
                return a.currency.localeCompare(b.currency);
            }
            if (a instanceof Balance && b instanceof Transaction) {
                return -compareTscsAndBalance(b, a);
            }
            if (a instanceof Transaction && b instanceof Balance) {
                return compareTscsAndBalance(a, b);
            }
        });
        function compareTscsAndBalance(tsc, balance) {
            const yearDiff= tsc.date.year() - balance.year;
            if (yearDiff !== 0) {
                return yearDiff;
            }
            const monthDiff = tsc.date.month() - balance.month;
            if (monthDiff !== 0) {
                return monthDiff;
            }
            // Balance is always after tsc with same month;
            return -1;
        }
    }
}

/**
* @param {string} params.currency
*/
export class Balance {
    constructor(params) {
        if (!params.currency) {
            throw new Error('currency missing in params when instantiating Balance ');
        }
        this.year = Number(params.year);
        this.month = Number(params.month);
        this.currency = params.currency.toUpperCase();
        this.change = new DollarValue();
        this.opening = new DollarValue();
        this.closing = new DollarValue();
    }
    isValid(startDate, endDate) {
        const month = moment(`${String(this.year)}-${String(this.month + 1)}`, 'YYYY-M');
        const validStart = startDate.isSame(month, 'month') || startDate.isBefore(month, 'month');
        const validEnd = endDate.isSame(month, 'month') || endDate.isAfter(month, 'month');
        return validStart && validEnd;
    }

    calculate(previousClosing) {
        if (previousClosing) {
            this.opening = previousClosing;
        }
        const c = this.currency;
        this.closing[c] = this.opening[c] + this.change[c];
    }
}

/**
* @param {string} params.currency
*/
// Balance structure should be
// data: {
//     2016: {
//         0: DollarValue,
//         ...
//         11: DollarValue
//     }
//     ...
//     2019: {
//         ...
//     }
// }
class TotalBalance {
    constructor(params) {
        if (!params.currency) {
            throw new Error('currency missing in params when instantiating TotalBalance ');
        }
        this.currency = params.currency.toUpperCase();
        this.data = {};
    }
    initBalance(year, month) {
        if (!this.data[year]) {
            this.data[year] = {};
        }
        if (!this.data[year][month]) {
            this.data[year][month] = new Balance({
                currency: this.currency,
                year,
                month
            });
        }
    }
    plus(year, month, value) {
        if (isNaN(value)) {
            throw new Error('value is NaN');
        }
        const currency = this.currency;
        this.initBalance(year, month);
        this.data[year][month].change[currency] += value;
    }
    minus(year, month, value) {
        if (isNaN(value)) {
            throw new Error('value is NaN');
        }
        const currency = this.currency;
        this.initBalance(year, month);
        this.data[year][month].change[currency] -= value;
    }
    getSortedKeys(object) {
        const entries = Object.keys(object);
        return entries.sort((key1, key2) => {
            return Number(key1) - Number(key2);
        });
    }
    getSortedYear() {
        return this.getSortedKeys(this.data);
    }
    getSortedMonth(yearData) {
        return this.getSortedKeys(yearData);
    }
    // Calculate opening and closing for each month.
    // Only do this when change for each month is already added
    calculate() {
        const years = this.getSortedYear();
        years.reduce((lastYear, year) => {
            const months = this.getSortedMonth(this.data[year]);
            let lastYearMonths = [];
            if (lastYear) {
                lastYearMonths = this.getSortedMonth(this.data[lastYear]);
            }
            months.reduce((lastMonth, month) => {
                const currentBalance = this.data[year][month];
                let lastBalance = this.data[year][lastMonth];
                if (!lastMonth && lastYear) {
                    lastBalance = this.data[lastYear][lastYearMonths[lastYearMonths.length -1]];
                }
                currentBalance.calculate(lastBalance && lastBalance.closing);
                return month;
            }, null);
            return year;
        }, null);
    }
    combine(balance) {
        if (this.currency !== balance.currency) {
            throw new Error('currency has to be same. We got ',
                this.currency, ' and ', balance.currency);
        }
        Object.entries(balance.data).forEach(([year, yearData]) => {
            Object.entries(yearData).forEach(([month, monthValue]) => {
                this.plus(year, month, monthValue.change[this.currency]);
            });
        });
    }
}

const CASH_PROPERTIES = {
    // TODO probably don't need DollarValue, just a number is good.
    // Used it to make table cell happy for now.
    total: DollarValue
};


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
     * @param {string} params.currency
     */
    constructor(params) {
        super();
        this.currency = params.currency.toUpperCase();
        this.transactions = [];
        this.total = new DollarValue();
        this.balance = new TotalBalance({currency: this.currency});
    }
    plus(tsc) {
        const currency = this.currency;
        const value = tsc.total[currency];
        const year = tsc.date.year();
        const month = tsc.date.month();
        this.total[currency] += value;
        this.balance.plus(year, month, value);
    }
    minus(tsc) {
        const currency = this.currency;
        const value = tsc.total[currency];
        const year = tsc.date.year();
        const month = tsc.date.month();
        this.total[currency] -= value;
        this.balance.minus(year, month, value);
    }
    // Add up cash transactions.
    // Do holding calculation first to add cach balance.
    calculate() {
        this.transactions.forEach(tsc => {
            let {type, unfoundRate, currency} = tsc;
            if (tsc.currency !== currency) {
                return;
            }
            this.unfoundRate = this.unfoundRate || unfoundRate;
            if (type === 'deposit') {
                this.plus(tsc);
            } else if (type === 'withdraw') {
                this.minus(tsc);
            }
        });
        this.balance.calculate();
    }
    clone() {
        let cloned = new Cash(this);
        cloned.unfoundRate = this.unfoundRate;
        cloned.transactions = cloned.transactions.concat(this.transactions);
        cloned.total = this.total.clone();
        cloned.balance.combine(this.balance);
        return cloned;
    }
    combine(cash) {
        this.total.add(cash.total);
        this.balance.combine(cash.balance);
        this.transactions = this.transactions.concat(cash.transactions);
        this.unfoundRate = this.unfoundRate || cash.unfoundRate;
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
                        cash.minus(tsc);
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
                        cash.plus(tsc);
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
                        cash.plus(tsc);
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

    setAverage() {
        DollarValue.TYPES.forEach(currency => {
            this.averageCost[currency] = round(divide(this.cost[currency], this.shares[currency]), 3);
        });
    }
}

Holding.HOLDING_PROPERTIES = HOLDING_PROPERTIES;