/**
 * Return a selector function that takes transactions and calculate holdings
 * with shares and cost.
 */
const createHoldingCalculator = () => {
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
    const _loadTransactionsToHolding = transactions => {
        let holdings = [];
        //TODO sort by date
        if (!Array.isArray(transactions)) {
            return [];
        }
        transactions.forEach((trsc) => {
            let holding = holdings.find(x => x.symbol === trsc.symbol);
            if (!holding) {
                holding = {
                  symbol: trsc.symbol,
                  sellTransactions: [],
                  buyTransactions: []
                };
                holdings.push(holding);
            }
            if (trsc.type === 'buy') {
                holding.buyTransactions.push(trsc);
            } else {
                holding.sellTransactions.push(trsc);
            }
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

        holding.buyTransactions.forEach(buyTsc => {
            buyTsc.leftShares = buyTsc.shares;
            buyTsc.cost = buyTsc.shares * buyTsc.price + buyTsc.commission;
        });

        // minus sold shares from each buy transaction until sold shares
        // is empty.
        holding.sellTransactions.forEach(sellTsc => {
            let soldShares = sellTsc.shares;
            sellTsc.realized_gain = 0;
            sellTsc.total_sales = sellTsc.shares * sellTsc.price - sellTsc.commission;

            for(let i = 0;i < holding.buyTransactions.length; ++i) {
                if (soldShares === 0) {
                    break;
                }

                let buyTsc = holding.buyTransactions[i];
                let processingShares = Math.min(buyTsc.leftShares, soldShares);

                let buyCost = (processingShares / buyTsc.shares) * buyTsc.cost;
                let sellGain = (processingShares / sellTsc.shares) * sellTsc.total_sales;
                sellTsc.realized_gain += sellGain - buyCost;

                soldShares -= processingShares;
                buyTsc.leftShares -= processingShares;
            }
        });

        // Calculate the buy cost based on left over shares on each buy transaction.
        holding.buyTransactions.forEach(buyTsc => {
            holding.cost += (buyTsc.leftShares / buyTsc.shares) * buyTsc.cost;
            holding.cost_overall += buyTsc.cost;
            holding.shares += buyTsc.leftShares;
        });

        // Calculate the realized gain based on left over shares on each buy transaction.
        holding.sellTransactions.forEach(sellTsc=> {
            holding.realized_gain += sellTsc.realized_gain;
        });

        holding.average_cost = holding.cost / holding.shares;

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