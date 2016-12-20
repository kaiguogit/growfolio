import {WebAPI} from '../web-api';
import {API} from './api';

export class HoldingService {
    static inject = [WebAPI, API];

    constructor(api, realAPI) {
        this.api = api;
        this.realAPI = realAPI;
        this.holdings = [];
    }

    /*
     * Load transaction, quotes and calculate properties.
     */
    load() {
        return this._loadTransactionsToHolding().then(() => {
            return this.refresh();
        });
    }

    /*
     * Refresh quotes and calculate properties.
     */
    refresh() {
        return this._loadQuotes().then(() => this._calculate(this.holdings));
    }

    _loadTransactionsToHolding() {
        // make it short
        let map = this.holdings;
        return this.api.getTransactionList().then((transactions) => {
            //TODO sort by date
            transactions.forEach((trsc) => {
                let holding = map.find(x => x.symbol === trsc.symbol);
                if (!holding) {
                    holding = {
                        symbol: trsc.symbol,
                        sellTransactions: [],
                        buyTransactions: [],
                        cost: 0
                    };
                    map.push(holding);
                }
                if (trsc.type === 'buy') {
                    holding.buyTransactions.push(trsc)
                } else {
                    holding.sellTransactions.push(trsc);
                }
            });
        });
    }

    _loadQuotes() {
        let symbols = this.holdings.map(x => x.symbol);
        // save quote into each symbol holding
        return this.realAPI.getQuotes(symbols).then(quotes => {
            quotes.forEach(quote => {
                let holding = this.holdings.find(x => x.symbol === quote.symbol);
                holding.quote = quote;
            })
        });
    }

    _calculate(holdings) {
        holdings.forEach((holding) => {
            this._calcHoldingCost(holding);
            holding.mkt_value = holding.shares * holding.quote.LastTradePriceOnly;
            holding.gain = holding.mkt_value - holding.cost;
            holding.gain_percent = holding.gain / holding.cost;
            holding.days_gain = holding.shares * holding.quote.Change;
        });
    }

    /*
     * Calculate the cost for each symbol based on transcations.
     * Add keys: shares, cost.
     * @param holdings: Holdings array
     */
    _calcHoldingCost(holding) {
        let soldShares = holding.sellTransactions.reduce((acc, cur) => {
            return acc + cur.shares;
        }, 0);
        holding.cost = 0;
        holding.shares = 0;

        // minus sold shares from each buy transaction until sold shares
        // is empty. Calculate the buy cost based on left over shares on
        // each transaction.
        holding.buyTransactions.forEach((trsc) => {
            let leftShares, cost;

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
        }, 0);
    };
}