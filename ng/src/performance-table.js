import {WebAPI} from './web-api';

export class PerformanceTable {
    static inject = [WebAPI];

    constructor(api) {
        this.api = api;
        this.holdings = {};
    }

    _getTransactions() {
        return this.api.getTransactionList()
        .then(transactions => this.transactions = transactions);
    }

    created() {
        this._loadData();
    }

    _loadData() {
        this._getTransactions().then( () => {
            let holdingMap = {};
            //TODO sort by date
            this.transactions.forEach((trsc) => {
                if (!holdingMap[trsc.symbol]) {
                    holdingMap[trsc.symbol] = {
                        symbol: trsc.symbol,
                        sellTransactions: [],
                        buyTransactions: [],
                        cost: 0
                    };
                }
                if (trsc.type === 'buy') {
                    holdingMap[trsc.symbol].buyTransactions.push(trsc)
                } else {
                    holdingMap[trsc.symbol].sellTransactions.push(trsc);
                }
            });

            this._calcHoldingCost(holdingMap);
            this.holdings = Object.values(holdingMap);
        });
    }

    _calcHoldingCost(holdings) {
        Object.keys(holdings).forEach((symbol) => {
            let holding = holdings[symbol];
            let soldShares = holding.sellTransactions.reduce((acc, cur) => {
                    return acc + cur.shares;
            }, 0);

            // minus sold shares from each buy transaction until sold shares
            // is empty. Calculate the buy cost based on left over shares on
            // each transaction.
            holding.cost = holding.buyTransactions.reduce((acc, trsc) => {
                let leftShares, cost;

                if (trsc.shares < soldShares) {
                    leftShares = 0;
                    soldShares -= trsc.shares;
                } else {
                    leftShares = trsc.shares - soldShares;
                    soldShares = 0;
                }
                cost = (leftShares / trsc.shares) *
                    (trsc.shares * trsc.price + trsc.commission);
                return acc + cost;
            }, 0);
        });
    }
}