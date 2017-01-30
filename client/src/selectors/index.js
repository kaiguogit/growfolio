import { createSelectorCreator, defaultMemoize } from 'reselect';
import createHoldingCalculator from './holdingCalculator';
import isEqual from 'lodash.isequal';

// Input selectors
export const getTscs = state => state.tscs.items;
export const getQuotes = state => state.quotes.items;
export const getQuote = (state, props) => state.quotes.items[props.symbol];
export const getSymbolFromProps = (state, props) => props.symbol;
export const getCurrency = state => state.currency.rate;
export const getDisplayCurrency = state => state.portfolio.displayCurrency;
export const getBalance = state => state.balance;
// Memoized selector
// Read more from https://github.com/reactjs/reselect
// Use lodash.isequal library to compare array of tscs to avoid recalculating
export const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

// Use createHoldingCalculator selector to calculate holdings.
// If tscs in state is not 'changed' (value-wise, the object is
// actually new), it won't recalculate.
// signature for selector created by createHoldingCalculator is (transactions) => holdings
// signature for getHoldings is (state) => holdings
export const getHoldings = createDeepEqualSelector([getTscs], createHoldingCalculator());
export const getHolding = createDeepEqualSelector(
    [getHoldings, getSymbolFromProps],
    (holdings, symbol) => holdings.find(x => x.symbol === symbol)
);

const convertHoldingCurrency = (holding, currency, displayCurrency) => {
    let rate = 1;
    if (holding.currency !== displayCurrency) {
        let pair = currency.find(x => x.id === holding.currency + displayCurrency);
        if (pair) {
            rate = pair.Rate;
            // Properties before quote calculation
            holding.cost *= rate;
            holding.cost_overall *= rate;
            holding.realized_gain *= rate;
            holding.average_cost *= rate;
            holding.dividend *= rate;
            // Properties after quote calculation
            holding.price *= rate;
            holding.change *= rate;
            holding.mkt_value *= rate;
            holding.gain *= rate;
            holding.days_gain *= rate;
            holding.gain_overall *= rate;
        }
    }
};

const calculateHoldingPerformance = (holding, quote, currency, displayCurrency) => {
        let newHolding = Object.assign({}, holding);
        if (quote &&
            typeof newHolding.shares === 'number' && typeof newHolding.cost === 'number' &&
            typeof newHolding.realized_gain === 'number' &&
            typeof newHolding.cost_overall === 'number') {
            newHolding.price = quote.current_price * 1;
            newHolding.change = quote.change * 1;
            newHolding.change_percent = quote.change_percent * 1;
            newHolding.mkt_value = newHolding.shares * newHolding.price;
            newHolding.gain = newHolding.mkt_value - newHolding.cost;
            newHolding.gain_percent = newHolding.gain / newHolding.cost;
            newHolding.days_gain = newHolding.shares * newHolding.change;
        } else {
            // If quote is not found, still make property available
            // to avoid NaN in sum calculation.
            newHolding.price = 0;
            newHolding.mkt_value = 0;
            newHolding.gain = 0;
            newHolding.gain_percent = 0;
            newHolding.days_gain = 0;
        }
        newHolding.gain_overall = newHolding.gain + newHolding.realized_gain;
        newHolding.gain_overall_percent = newHolding.gain_overall / newHolding.cost_overall;
        convertHoldingCurrency(newHolding, currency, displayCurrency);
        /** TODO: another way to achieve this is to make a better getQuote selector
         * Currently this calculation is triggered when anything in quote is new.
         * A better getQuote function should filter API response with only the
         * property that we care.
         * That way this calculation function is only triggered when quote that we care
         * is updated, and we can always return a new object instead of doing compare
         * like below.
         */
        // Return a new object to trigger props update.
        return newHolding;
};

/** Nest selector to further calculate holding gains based on Real Time Quotes
 * If holding is not changed, holdings based on transaction won't have to be calculated.
 * This is a make function to generate unique selector for 1 holding.
 * Usage:
 * // props.symbol is required
 * const makeMapStateToProps = () => {
 *     const getHoldingPerformance = makeGetHoldingPerformance();
 *     const mapStateToProps = (state, props) => {
 *          return {
 *              holding: getHoldingPerformance(state, props)
 *          }
 *     }
 *     return mapStateToProps;
 * }
 */
export const makeGetHoldingPerformance = () => {
    return createDeepEqualSelector([getHolding, getQuote, getCurrency, getDisplayCurrency], calculateHoldingPerformance);
};

export const getHoldingsPerformance = createDeepEqualSelector([getHoldings, getQuotes, getCurrency, getDisplayCurrency], (holdings, quotes, currency, displayCurrency) => {
    return holdings.map(holding => {
        return calculateHoldingPerformance(holding, quotes[holding.symbol], currency, displayCurrency);
    });
});

export const getTotalPerformance = createDeepEqualSelector([getHoldingsPerformance], holdings => {
    let mkt_value = 0,
        cost = 0,
        gain = 0,
        gain_percent = 0,
        days_gain = 0,
        change_percent = 0,
        gain_overall = 0,
        cost_overall = 0,
        gain_overall_percent = 0,
        realized_gain = 0,
        dividend = 0;
    holdings.forEach(holding => {
        mkt_value += holding.mkt_value;
        cost += holding.cost;
        gain += holding.gain;
        days_gain += holding.days_gain;
        gain_overall += holding.gain_overall;
        cost_overall += holding.cost_overall;
        realized_gain += holding.realized_gain;
        dividend += holding.dividend;
    });
    gain_percent = gain / cost;
    change_percent = days_gain / cost;
    gain_overall_percent = gain_overall / cost_overall;
    return {
        mkt_value,
        cost,
        gain,
        gain_percent,
        days_gain,
        change_percent,
        holdings,
        cost_overall,
        gain_overall,
        gain_overall_percent,
        realized_gain,
        dividend
    };
});

export const getBalanceArray = createDeepEqualSelector([getBalance], balance => {
    return Object.keys(balance).map(symbol => ({
        name: symbol,
        y: balance[symbol].percentage
    }));
});