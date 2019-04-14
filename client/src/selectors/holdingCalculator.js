import { divide } from '../utils';
import {DollarValue, DollarValueMap} from './transaction';
import {Holding, Account, Cash} from './holding';
import ACCOUNTS from '../constants/accounts';

const compareDate = (a, b) => {
    return new Date(a.date) - new Date(b.date);
};

const _getTscAccountMap = tscs => {
    return (tscs || []).reduce((map, tsc) => {
        let accountName = tsc.account || 'default';
        map[accountName] = map[accountName] || [];
        map[accountName].push(tsc);
        return map;
    }, {});
};

/**
 * calculate holdings based on transactions
 * @param {object} tscs transactions
 * @returns {object} key-value map, key is account, value is holdings array
 */
export const generateAccountsMap = (tscs, exchangeRates) => {
    let tscAccountMap = _getTscAccountMap(tscs);
    // Generate holdings for each account
    let accountMap = ACCOUNTS.reduce((map, account) => {
        if (account === 'all') {
            return map;
        }
        if (tscAccountMap[account]) {
            map[account] = new Account({
                tscs: tscAccountMap[account],
                exchangeRates
            });
        } else {
            map[account] = new Account();
        }
        return map;
    }, {});

    // Combine holdings of each account and same as "all" account.
    accountMap.all = Object.keys(accountMap).reduce((result, accountName) => {
        let account = accountMap[accountName];
        const clone = holding => {
            let combinedHolding = result.holdings.find(h => h.symbol === holding.symbol);
            if (combinedHolding) {
                Object.keys(Holding.HOLDING_PROPERTIES).forEach(key => {
                    combinedHolding[key].add(holding[key]);
                });
                combinedHolding.transactions = combinedHolding.transactions.concat(holding.transactions);
                combinedHolding.unfoundRate = combinedHolding.unfoundRate || holding.unfoundRate;
            } else {
                combinedHolding = holding.clone();
                result.holdings.push(combinedHolding);
            }
        };
        const cloneCash = ([currency, cash]) => {
            let combinedCash = result.cash[currency];
            if (combinedCash) {
                Object.keys(Cash.CASH_PROPERTIES).forEach(key => {
                    combinedCash[key].add(cash[key]);
                });
                combinedCash.transactions = combinedCash.transactions.concat(cash.transactions);
                combinedCash.unfoundRate = combinedCash.unfoundRate || cash.unfoundRate;
            } else {
                combinedCash = cash.clone();
                result.cash[currency] = combinedCash;
            }
        };
        account.holdings.forEach(clone);
        Object.entries(account.cash).forEach(cloneCash);
        return result;
    }, new Account());
    accountMap.all.holdings.forEach(holding =>
        holding.transactions.sort(compareDate)
    );
    Object.values(accountMap.all.cash).forEach(cash => {
        cash.transactions.sort(compareDate);
    });
    return accountMap;
};

/**
 * Output selectors, add performance data to holdings
 * Add {
 *    price                    (price from quote API),
 *    change                   (day's price change from quote API)
 *    changePercent           (day's price change percent from quote API),
 *    mktValue                (shares * price),
 *    gain                     (mktValue - cost),
 *    gainPercent             (gain / cost),
 *    daysGain                (change * shares),
 *    gainOverall             (gain + realizedGain),
 * }
 * @param {object} holding
 * @param {object} quote quote data for the holding
 * @param {number} rate USD/CAD exchange rate
 * @returns {object} holding with performance data
 */
export const calculateHoldingPerformance = (holding, quote, rate) => {
        let h = Object.assign({}, holding);
        let cost = h.cost;
        let realizedGain = h.realizedGain;
        let shares = h.shares;
        ['price', 'change', 'mktValue', 'gain', 'gainPercent', 'daysGain', 'gainOverall']
        .forEach(key => {
            h[key] = new DollarValue();
        });
        const convertCurrency = (to, value) => {
            if (!value) {
                return 0;
            }
            const from = holding.currency;
            if (from === to) {
                return value;
            }
            return from === 'USD' ? value * rate : divide(value, rate);
        };
        quote = quote || {};
        DollarValue.TYPES.forEach(c => {
            h.price[c] = convertCurrency(c, quote.close);
            h.change[c] = convertCurrency(c, quote.change);
            h.quoteDate = quote.date || 'N/A';
            h.changePercent = quote.changePercent || 0;
            h.mktValue[c] = shares[c] * h.price[c];
            h.gain[c] = h.mktValue[c] ? h.mktValue[c] - cost[c] : 0;
            h.gainPercent[c] = divide(h.gain[c], cost[c]);
            h.daysGain[c] = shares[c] * h.change[c];
            h.gainOverall[c] = h.gain[c] + realizedGain[c];
        });
        // Return a new object to trigger props update.
        return h;
};

/**
 * Sum up holding's value and caculate total performance.
 * @param {array} holdings
 * @returns {object}
 */
export const calculateTotalPerformance = (holdings, displayCurrency) => {
    const sumProps = ['mktValue', 'cost', 'gain', 'daysGain', 'gainOverall',
        'realizedGain', 'dividend', 'realizedGainYearly', 'capitalGainYearly', 'dividendYearly'];
    const rt = {holdings};

    holdings.forEach(holding => {
        sumProps.forEach(prop => {
            rt[prop] = rt[prop] || 0;
            if (holding[prop] instanceof DollarValue) {
                rt[prop] += holding[prop][displayCurrency];
            } else if (holding[prop] instanceof DollarValueMap) {
                Object.entries(holding[prop].map).forEach(([key, dollarValue]) => {
                    rt[prop] = rt[prop] || new DollarValueMap();
                    rt[prop].addValue(key, dollarValue[displayCurrency], displayCurrency);
                });
            } else {
                rt[prop] += holding[prop];
            }
        });
    });
    rt.currency = displayCurrency;
    rt.gainPercent = divide(rt.gain, rt.cost);
    rt.changePercent = divide(rt.daysGain, rt.cost);
    return rt;
};

export const calculateTotalCashTscs = tscs => {
    const sumProps = ['deposit', 'withdraw'];
    const rt = {};
    DollarValue.TYPES.forEach(currency => {
        const sum = rt[currency] = {
            currency,
            isTotal: true
        };
        tscs.forEach(tsc => {
            if (tsc.currency === currency) {
                sumProps.forEach(prop => {
                    sum[prop] = sum[prop] || 0;
                    if (tsc.total instanceof DollarValue && tsc.type === prop) {
                        sum[prop] += tsc.total[currency];
                    }
                });
            }
        });
    });
    return rt;
};
