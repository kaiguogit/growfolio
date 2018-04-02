import { round, divide, avoidNaN } from '../utils';
import Transaction from './transaction';
import ACCOUNTS from '../constants/accounts';

const HOLDING_PROPERTIES = [
    'cost',
    'costCAD',
    'costOverall',
    'costOverallCAD',
    'shares',
    'averageCost',
    'averageCostCAD',
    'realizedGain',
    'dividend',
    'realizedGainCAD',
    'dividendCAD'
];

const TSCS_PROPERTIES = [
    'transactions',
    'buyTransactions',
    'sellTransactions'
];
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
const _calcHoldings = (tscs) => {
    let holdings = [];
    // TODO verify tscs by date. Such as whether there is enough shares to
    // sell
    tscs.forEach(tsc => {
        // new object
        tsc = new Transaction(tsc);
        // Create holding and add tsc to it.
        let holding = holdings.find(x => x.symbol === tsc.symbol);
        if (!holding) {
            holding = {
                name: tsc.name,
                symbol: tsc.symbol,
                currency: tsc.currency,
                exch: tsc.exch,
                transactions: [],
                sellTransactions: [],
                buyTransactions: [],
                dividendTransactions: []
            };
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
        TSCS_PROPERTIES.forEach(property =>
            holding[property].sort(compareDate)
        );
        _calcHoldingCost(holding);
    });
    return holdings;
};

const _setZero = (properties, value) => {
    properties.forEach(property => value[property] = 0);
};

const _getRealTimeRate = (rates, currency) => {
    return rates && rates[currency] || 1;
};
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
const _calcHoldingCost = (holding) => {
    _setZero(HOLDING_PROPERTIES, holding);
    // Assuming the transactions here are already sorted by date.
    holding.transactions.forEach(tsc => {
        let rate;
        const isUSD = tsc.currency === 'USD';
        if (isUSD) {
            rate = tsc.rate;
            if (!rate) {
                rate = 1;
                holding.unfoundRate = true;
            }
        }
        // http://www.moneysense.ca/invest/calculating-capital-gains-on-u-s-stocks/
        // Keep track of CAD based ACB.
        // You need to determine the cost in Canadian dollars
        // based on the exchange rate at the time of purchase and do the same for the sale proceeds
        // based on the current exchange rate.
        if (tsc.type === 'buy' || tsc.type === 'sell') {
            if (tsc.type === 'buy') {
                tsc.acbChange = tsc.total;
                tsc.acbChangeCAD = tsc.totalCAD;
                // Accumulate all buy cost or overall return.
                holding.costOverall += tsc.acbChange;
                holding.costOverallCAD += tsc.acbChangeCAD;
                holding.shares += tsc.shares;
            } else if (tsc.type === 'sell') {
                // acb change is cost * (sold shares / holding shares)
                tsc.acbChange = - divide(holding.cost * tsc.shares, holding.shares);
                tsc.acbChangeCAD = - divide(holding.costCAD * tsc.shares, holding.shares);
                tsc.realizedGain = tsc.total + tsc.acbChange;
                tsc.realizedGainCAD = tsc.totalCAD + tsc.acbChangeCAD;
                holding.realizedGain += tsc.realizedGain;
                holding.realizedGainCAD += tsc.realizedGainCAD;
                holding.shares -= tsc.shares;
            }
        } else if (tsc.type === 'dividend') {
            // http://canadianmoneyforum.com/showthread.php/10747-quot-Notional-distribution-quot-question
            // Return of capital decrease cost
            tsc.acbChange = 0;
            tsc.acbChangeCAD = 0;
            if (tsc.returnOfCapital) {
                tsc.acbChange = - tsc.returnOfCapital;
                tsc.acbChangeCAD = - tsc.returnOfCapitalCAD;
            }
            // Capital gain is not distributed to me, they are reinvested inside of the fund
            // Since I will pay tax on it, therefore it increases the cost
            if (tsc.capitalGain) {
                tsc.acbChange += tsc.capitalGain;
                tsc.acbChangeCAD += tsc.capitalGainCAD;
            }
            // Accumulate all buy cost or overall return.
            holding.costOverall += tsc.acbChange;
            holding.costOverallCAD += tsc.acbChangeCAD;
            tsc.realizedGain = tsc.total;
            tsc.realizedGainCAD = tsc.totalCAD;
            holding.realizedGain += tsc.realizedGain;
            holding.realizedGainCAD += tsc.realizedGainCAD;
            holding.dividend += tsc.realizedGain;
            holding.dividendCAD += tsc.realizedGainCAD;
        }
        holding.cost += tsc.acbChange;
        holding.costCAD += tsc.acbChangeCAD;
        tsc.acbChange = round(tsc.acbChange, 3);
        tsc.acbChangeCAD = round(tsc.acbChangeCAD, 3);
        // ACB status for tsc
        // Not sure why, but 774 * 47.19 + 9.95 = 36535.009999999995 instead of
        // 36536.01
        // so round last 3 digit for these properties
        if (holding.shares) {
            tsc.newAcb = round(holding.cost, 3);
            tsc.newAverageCost = round(divide(holding.cost, holding.shares), 3);
            tsc.newAcbCAD = round(holding.costCAD, 3);
            tsc.newAverageCostCAD = round(divide(holding.costCAD, holding.shares), 3);
        } else {
            tsc.newAcb = 0;
            tsc.newAverageCost = 0;
            tsc.newAcbCAD = 0;
            tsc.newAverageCostCAD = 0;
        }
    });

    if (holding.shares) {
        holding.cost = round(holding.cost, 3);
        holding.costCAD = round(holding.costCAD, 3);
    } else {
        // Clear cost if share is 0, since it maybe very small
        // number after minize sell transacations.
        holding.cost = 0;
        holding.costCAD = 0;
    }

    holding.averageCost = divide(holding.cost, holding.shares);
    holding.averageCostCAD = divide(holding.costCAD, holding.shares);
    avoidNaN(HOLDING_PROPERTIES, holding);
};

const _getTscAccountMap = (tscs) => {
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
export const generateAccountHoldingsMap = (tscs, historicalRate) => {
    let tscAccountMap = _getTscAccountMap(tscs);
    // Generate holdings for each account
    let holdingAccountMap = ACCOUNTS.reduce((map, account) => {
        if (account === 'all') {
            return map;
        }
        if (tscAccountMap[account]) {
            map[account] = _calcHoldings(tscAccountMap[account], historicalRate);
        }
        return map;
    }, {});

    // Combine holdings of each account and same as "all" account.
    holdingAccountMap.all = Object.keys(holdingAccountMap).reduce((result, account) => {
        let holdings = holdingAccountMap[account];
        holdings.forEach((holding) => {
            let combinedHolding = result.find(h =>
                h.symbol === holding.symbol
            );
            if (combinedHolding) {
                HOLDING_PROPERTIES.forEach(property =>
                    combinedHolding[property] += holding[property]
                );
                TSCS_PROPERTIES.forEach(property =>
                    combinedHolding[property] = combinedHolding[property].concat(holding[property])
                );
                combinedHolding.unfoundRate = combinedHolding.unfoundRate || holding.unfoundRate;
            } else {
                combinedHolding = Object.assign({}, holding);
                result.push(combinedHolding);
            }
        });
        return result;
    }, []);
    holdingAccountMap.all.forEach(holding =>
        TSCS_PROPERTIES.forEach(property =>
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
 *    mkt_value                (shares * price),
 *    gain                     (mkt_value - cost),
 *    gainPercent             (gain / cost),
 *    daysGain                (change * shares),
 *    gainOverall             (gain + realizedGain),
 *    gainOverallPercent     (gainOverall / costOverall)
 * }
 * @param {object} holding
 * @param {object} quote quote data for the holding
 * @param {array} currencyRates currency map
 * @param {string} displayCurrency setting
 * @returns {object} holding with performance data
 */
export const calculateHoldingPerformance = (holding, quote, currencyRates) => {
        let h = Object.assign({}, holding);
        if (quote &&
            typeof h.shares === 'number' && typeof h.cost === 'number' &&
            typeof h.realizedGain === 'number' &&
            typeof h.costOverall === 'number') {
                h.price = quote.current_price;
                h.change = quote.change * 1;
                h.changePercent = quote.changePercent * 1;
                h.mkt_value = h.shares * h.price;
                h.gain = h.mkt_value - h.cost;
                h.gainPercent = divide(h.gain, h.cost);
                h.daysGain = h.shares * h.change;
        } else {
            // If quote is not found, still make property available
            // to avoid NaN in sum calculation.
            h.price = 0;
            h.mkt_value = 0;
            h.gain = 0;
            h.gainPercent = 0;
            h.daysGain = 0;
        }
        h.gainOverall = h.gain + h.realizedGain;
        h.gainOverallPercent = divide(h.gainOverall, h.costOverall);
        if (holding.currency === 'USD') {
            h.gainOverallCAD = h.gain * _getRealTimeRate(currencyRates, holding.currency) +
                h.realizedGainCAD;
        }
        /** TODO: another way to achieve this is to make a better getQuote selector
         * Currently this calculation is triggered when anything in quote is new.
         * A better getQuote function should filter API response with only the
         * property that we care.
         * That way this calculation function is only triggered when quote that we care
         * is updated, and we can always return a new object instead of doing compare
         * like below.
         */
        // Return a new object to trigger props update.
        return h;
};

/**
 * Sum up holding's value and caculate total performance.
 * @param {array} holdings
 * @returns {object}
 */
export const calculateTotalPerformance = holdings => {
    const sumProps = ['mkt_value', 'cost', 'gain', 'daysGain', 'gainOverall', 'costOverall',
                   'realizedGain', 'dividend'];
    const rt = {holdings};

    holdings.forEach(holding => {
        sumProps.forEach(prop => {
            rt[prop] = rt[prop] || 0;
            if (holding.currency === 'USD') {
                if (prop === 'realizedGain') {
                    rt[prop] += holding.realizedGainCAD;
                } else if (prop === 'dividend') {
                    rt[prop] += holding.dividendCAD;
                } else if (prop === 'gainOverall') {
                    rt[prop] += holding.gainOverallCAD;
                } else if (prop === 'costOverall') {
                    rt[prop] += holding.costOverallCAD;
                }
            } else {
                rt[prop] += holding[prop];
            }
        });
    });
    rt.gainPercent = divide(rt.gain, rt.cost);
    rt.changePercent = divide(rt.daysGain, rt.cost);
    rt.gainOverallPercent = divide(rt.gainOverall, rt.costOverall);
    return rt;
};