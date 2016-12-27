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
     * @return holding It will calculate cost and shares for the holding
     */
    const _calcHoldingCost = holding => {
        let soldShares = holding.sellTransactions.reduce((acc, cur) => {
          return acc + cur.shares;
        }, 0);
        holding.cost = 0;
        holding.shares = 0;

        // minus sold shares from each buy transaction until sold shares
        // is empty. Calculate the buy cost based on left over shares on
        // each transaction.
        holding.buyTransactions.forEach((trsc) => {
            //left share for this transaction
            let leftShares;

            if (trsc.shares < soldShares) {
                leftShares = 0;
                soldShares -= trsc.shares;
            } else {
                leftShares = trsc.shares - soldShares;
                soldShares = 0;
            }
            holding.cost += (leftShares / trsc.shares) *
                (trsc.shares * trsc.price + trsc.commission);
            holding.shares += leftShares;
        });
        return holding;
    };

    /**
     * calculate holdings based on transactions
     */
    const selector = (transactions) => {
        console.log('calculating holdings');
        let holdings = _loadTransactionsToHolding(transactions);
        holdings.forEach(_calcHoldingCost);
        console.log('holdings is', holdings);
        return holdings;
    };

    return selector;
};

export default createHoldingCalculator;