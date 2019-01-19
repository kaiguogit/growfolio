import { divide } from '../utils';
import {Transaction, DollarValue, DollarValueMap} from './transaction';
import Holding from './holding';
import ACCOUNTS from '../constants/accounts';

const compareDate = (a, b) => {
    return new Date(a.date) - new Date(b.date);
};
/**
 * generate an array of holdings based on transactions
 * holdings map will be
 * [{symbol: 'YHOO',
 *   sellTransactions: [] array of sell transactions,
 *   buyTransactions: [] array of buy transactions
 *  },
 *  ...
 * ]
 * @param {array} tscs transactions
 */
const _calcHoldings = (tscs, exchangeRates) => {
    let holdings = [];
    // TODO verify tscs by date. Such as whether there is enough shares to
    // sell
    tscs.forEach(tsc => {
        // new object
        tsc = new Transaction(tsc, exchangeRates);
        // Create holding and add tsc to it.
        let holding = holdings.find(x => x.symbol === tsc.symbol);
        if (!holding) {
            holding = new Holding({
                name: tsc.name,
                symbol: tsc.symbol,
                currency: tsc.currency,
                exch: tsc.exch
            });
            holdings.push(holding);
        }
        holding.transactions.push(tsc);
        if (tsc.type === 'buy') {
            holding.buyTransactions.push(tsc);
        } else if (tsc.type === 'sell') {
            holding.sellTransactions.push(tsc);
        } else if (tsc.type === 'dividend') {
            holding.dividendTransactions.push(tsc);
        }
    });

    holdings.forEach(holding => {
        Holding.TSCS_PROPERTIES.forEach(property =>
            holding[property].sort(compareDate)
        );
        holding.calculate();
    });
    return holdings;
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
export const generateAccountHoldingsMap = (tscs, exchangeRates) => {
    let tscAccountMap = _getTscAccountMap(tscs);
    // Generate holdings for each account
    let holdingAccountMap = ACCOUNTS.reduce((map, account) => {
        if (account === 'all') {
            return map;
        }
        if (tscAccountMap[account]) {
            map[account] = _calcHoldings(tscAccountMap[account], exchangeRates);
        }
        return map;
    }, {});

    // Combine holdings of each account and same as "all" account.
    holdingAccountMap.all = Object.keys(holdingAccountMap).reduce((result, account) => {
        let holdings = holdingAccountMap[account];
        holdings.forEach(holding => {
            let combinedHolding = result.find(h =>
                h.symbol === holding.symbol
            );
            if (combinedHolding) {
                Object.keys(Holding.HOLDING_PROPERTIES).forEach(key => {
                    combinedHolding[key].add(holding[key]);
                });
                Holding.TSCS_PROPERTIES.forEach(property =>
                    combinedHolding[property] = combinedHolding[property].concat(holding[property])
                );
                combinedHolding.unfoundRate = combinedHolding.unfoundRate || holding.unfoundRate;
            } else {
                combinedHolding = holding.clone();
                result.push(combinedHolding);
            }
        });
        return result;
    }, []);
    holdingAccountMap.all.forEach(holding =>
        Holding.TSCS_PROPERTIES.forEach(property =>
            holding[property].sort(compareDate)
        )
    );
    return holdingAccountMap;
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
 *    gainOverallPercent     (gainOverall / costOverall)
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
        let costOverall = h.costOverall;
        let shares = h.shares;
        ['price', 'change', 'mktValue', 'gain', 'gainPercent', 'daysGain', 'gainOverall',
        'gainOverallPercent'].forEach(key => {
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
            h.gainOverallPercent[c] = divide(h.gainOverall[c], costOverall[c]);
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
    const sumProps = ['mktValue', 'cost', 'gain', 'daysGain', 'gainOverall', 'costOverall',
                   'realizedGain', 'dividend', 'realizedGainYearly', 'dividendYearly'];
    const rt = {holdings};

    holdings.forEach(holding => {
        sumProps.forEach(prop => {
            rt[prop] = rt[prop] || 0;
            if (holding[prop] instanceof DollarValue) {
                rt[prop] += holding[prop][displayCurrency];
            } else if (holding[prop] instanceof DollarValueMap) {
                Object.entries(holding[prop].map).forEach(([key, value]) => {
                    rt[prop] = rt[prop] || {
                        map: {}
                    };
                    rt[prop].map[key] = rt[prop].map[key] || {
                        [displayCurrency]: 0
                    };
                    rt[prop].map[key][displayCurrency] += value[displayCurrency];
                });
            } else {
                rt[prop] += holding[prop];
            }
        });
    });
    rt.currency = displayCurrency;
    rt.gainPercent = divide(rt.gain, rt.cost);
    rt.changePercent = divide(rt.daysGain, rt.cost);
    rt.gainOverallPercent = divide(rt.gainOverall, rt.costOverall);
    return rt;
};