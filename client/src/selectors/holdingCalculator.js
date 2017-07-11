import { round, divide, avoidNaN } from '../utils';

/**
 * generate an array of holdings based on transactions
 * holdings map will be
 * [{symbol: 'YHOO',
 *   sellTransactions: [] array of sell transactions,
 *   buyTransactions: [] array of buy transactions
 *  },
 *  ...
 * ]
 */
const _loadTransactionsToHolding = tscsMap => {
    let holdings = [];
    // TODO verify tscs by date. Such as whether there is enough shares to
    // sell
    Object.keys(tscsMap).forEach(symbol => {
        let transactions = tscsMap[symbol];
        transactions.forEach((tsc) => {
            // new object
            tsc = Object.assign({}, tsc);
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
    });
    const compareDate = (a, b) => {
        return new Date(a.date) - new Date(b.date);
    };
    holdings.forEach(holding => {
        holding.buyTransactions.sort(compareDate);
        holding.sellTransactions.sort(compareDate);
        holding.dividendTransactions.sort(compareDate);
    });
    return holdings;
};

/*
    * Calculate the cost of holding for specified symbol based on transcations.
    * Add keys: shares, cost.
    * @param holding: The holding for specified symbol
    * @return holding with calculated
    *     cost (current holding cost),
    *     average_cost (current holding's cost per share),
    *     cost_overall (accumulated buying cost),
    *     shares (current holding cost),
    *     realized_gain (sold value - holding cost * (sold shares / holding shares))
    */
const _calcHoldingCost = holding => {
    holding.cost = 0;
    holding.cost_overall = 0;
    holding.shares = 0;
    holding.average_cost = 0;
    holding.realized_gain = 0;
    holding.dividend = 0;

    // Assuming the transactions here are already sorted by date.
    holding.transactions.forEach(tsc => {
        if (tsc.type === 'buy' || tsc.type === 'sell') {
            if (tsc.type === 'buy') {
                tsc.total = tsc.totalOrPerShare === 'true' ? tsc.price :
                    (tsc.shares * tsc.price + tsc.commission);
                tsc.acbChange = tsc.total;

                // Accumulate all buy cost or overall return.
                holding.cost_overall += tsc.acbChange;
                holding.shares += tsc.shares;

            } else if (tsc.type === 'sell') {
                tsc.total = tsc.totalOrPerShare === 'true' ? tsc.price :
                    (tsc.shares * tsc.price - tsc.commission);
                // acb change is cost * (sold shares / holding shares)
                tsc.acbChange = - divide(holding.cost * tsc.shares, holding.shares);
                tsc.realized_gain = tsc.total + tsc.acbChange;

                holding.shares -= tsc.shares;
                holding.realized_gain += tsc.realized_gain;
            }
            holding.cost += tsc.acbChange;
            tsc.acbChange = round(tsc.acbChange, 3);
            // ACB status for tsc
            // Not sure why, but 774 * 47.19 + 9.95 = 36535.009999999995 instead of
            // 36536.01
            // so round last 3 digit for these properties
            if (holding.shares) {
                tsc.newAcb = round(holding.cost, 3);
                tsc.newAverageCost = round(divide(holding.cost, holding.shares), 3);
            } else {
                tsc.newAcb = 0;
                tsc.newAverageCost = 0;
            }

        } else if (tsc.type === 'dividend') {
            tsc.total = tsc.totalOrPerShare  === 'true' ? tsc.price :
                (tsc.price * tsc.shares + tsc.commission);
            holding.realized_gain += tsc.total;
            holding.dividend += tsc.total;
        }

        tsc.total = round(tsc.total, 3);
    });

    if (holding.shares) {
        holding.cost = round(holding.cost, 3);
    } else {
        // Clear cost if share is 0, since it maybe very small
        // number after minize sell transacations.
        holding.cost = 0;
    }

    holding.average_cost = divide(holding.cost, holding.shares);
    avoidNaN([
        'cost',
        'cost_overall',
        'shares',
        'average_cost',
        'realized_gain'
    ], holding);
    return holding;
};

/**
 * calculate holdings based on transactions
 * @param {object} transactions map
 * @returns {array} holdings array
 */
export const generateHolding = (transactions) => {
    let holdings = _loadTransactionsToHolding(transactions);
    holdings.forEach(_calcHoldingCost);
    return holdings;
};

/**
 * Output selectors, convert holding's values based on provided displayCurrency setting.
 * @param {object} holding
 * @param {array} currencyRates The currency data in store.
 * @param {string} displayCurrency
 */
const convertHoldingCurrency = (holding, currencyRates, displayCurrency) => {
    let rate = 1;
    if (holding.currency !== displayCurrency) {
        let pair = (currencyRates || []).find(x => x.id === holding.currency + displayCurrency);
        if (pair) {
            rate = pair.Rate;
            const props = [
                // Properties before quote calculation
                'cost', 'cost_overall', 'realized_gain', 'average_cost', 'dividend',
                // Properties after quote calculation
                'price', 'change', 'mkt_value', 'gain', 'days_gain', 'gain_overall'
            ];
            props.forEach(prop => {
                holding[prop] *= rate;
            });
        }
    }
};

/**
 * Output selectors, add performance data to holdings
 * Add {
 *    price                    (price from quote API),
 *    change                   (day's price change from quote API)
 *    change_percent           (day's price change percent from quote API),
 *    mkt_value                (shares * price),
 *    gain                     (mkt_value - cost),
 *    gain_percent             (gain / cost),
 *    days_gain                (change * shares),
 *    gain_overall             (gain + realized_gain),
 *    gain_overall_percent     (gain_overall / cost_overall)
 * }
 * @param {object} holding
 * @param {object} quote quote data for the holding
 * @param {array} currencyRates currency map
 * @param {string} displayCurrency setting
 * @returns {object} holding with performance data
 */
export const calculateHoldingPerformance = (holding, quote, currencyRates, displayCurrency) => {
        let h = Object.assign({}, holding);
        if (quote &&
            typeof h.shares === 'number' && typeof h.cost === 'number' &&
            typeof h.realized_gain === 'number' &&
            typeof h.cost_overall === 'number') {
                h.price = quote.current_price;
                h.change = quote.change * 1;
                h.change_percent = quote.change_percent * 1;
                h.mkt_value = h.shares * h.price;
                h.gain = h.mkt_value - h.cost;
                h.gain_percent = divide(h.gain, h.cost);
                h.days_gain = h.shares * h.change;
        } else {
            // If quote is not found, still make property available
            // to avoid NaN in sum calculation.
            h.price = 0;
            h.mkt_value = 0;
            h.gain = 0;
            h.gain_percent = 0;
            h.days_gain = 0;
        }
        h.gain_overall = h.gain + h.realized_gain;
        h.gain_overall_percent = divide(h.gain_overall, h.cost_overall);
        convertHoldingCurrency(h, currencyRates, displayCurrency);
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
    const sumProps = ['mkt_value', 'cost', 'gain', 'days_gain', 'gain_overall', 'cost_overall',
                   'realized_gain', 'dividend'];
    const rt = {holdings};

    holdings.forEach(holding => {
        sumProps.forEach(prop => {
            rt[prop] = rt[prop] || 0;
            rt[prop] += holding[prop];
        });
    });
    rt.gain_percent = divide(rt.gain, rt.cost);
    rt.change_percent = divide(rt.days_gain, rt.cost);
    rt.gain_overall_percent = divide(rt.gain_overall, rt.cost_overall);
    return rt;
};