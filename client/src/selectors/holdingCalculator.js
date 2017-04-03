/**
 * Return a selector function that takes transactions and calculate holdings
 * with shares and cost.
 */
const createHoldingCalculator = () => {
    const avoidNaN = (keys, obj) => {
        keys.forEach(key => {
            if (key in obj) {
                obj[key] = isFinite(+obj[key]) ? +obj[key] : 0;
            }
        });
    };

    /**
     * round keys in object
     * http://www.javascriptkit.com/javatutors/round.shtml
     * @param {Number} digit, round at last x decimal
     */
    const round = (value, digit) => {
        let multiplier = Math.pow(10, digit);
        return Math.round(value * multiplier) / multiplier;
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
                // Guard NaN values
                avoidNaN(['shares', 'price', 'commission'], tsc);
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
     *     cost,
     *     cost_overall,
     *     shares,
     *     average_cost,
     *     realized_gain for the holding
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
                    tsc.total = tsc.shares * tsc.price + tsc.commission;
                    tsc.acbChange = tsc.total;

                    holding.cost_overall += tsc.acbChange;
                    holding.shares += tsc.shares;

                } else if (tsc.type === 'sell') {
                    tsc.total = tsc.shares * tsc.price - tsc.commission;
                    // TODO may need to check if holding.shares is 0
                    tsc.acbChange = -(holding.cost * tsc.shares / holding.shares);
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
                    tsc.newAverageCost = round(holding.cost / holding.shares, 3);
                } else {
                    tsc.newAcb = 0;
                    tsc.newAverageCost = 0;
                }

            } else if (tsc.type === 'dividend') {
                tsc.total = tsc.price * tsc.shares + tsc.commission;
                holding.realized_gain += tsc.total;
                holding.dividend += tsc.total;
            }

            tsc.total = round(tsc.total, 3);
        });
        holding.cost = round(holding.cost, 3);
        holding.average_cost = holding.shares ? holding.cost / holding.shares : 0;
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
     */
    const selector = (transactions) => {
        let holdings = _loadTransactionsToHolding(transactions);
        holdings.forEach(_calcHoldingCost);
        return holdings;
    };

    return selector;
};

export default createHoldingCalculator;