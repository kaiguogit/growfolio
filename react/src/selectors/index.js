import { createSelectorCreator, defaultMemoize } from 'reselect';
import createHoldingCalculator from './holdingCalculator';
import isEqual from 'lodash.isequal';

// Input selectors
const getTscs = state => state.tscs.items;
const getQuotes = state => state.quotes.items;
const getQuote = (state, props) => state.quotes.items[props.symbol];
const getSymbolFromProps = (state, props) => props.symbol;
// Memoized selector
// Read more from https://github.com/reactjs/reselect
// Use lodash.isequal library to compare array of tscs to avoid recalculating
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

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

const calculateHoldingPerformance = (holding, quote) => {
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
            newHolding.gain_overall = (newHolding.gain + newHolding.realized_gain) / newHolding.cost_overall;
        }

        /** TODO: another way to achieve this is to make a better getQuote selector
         * Currently this calculation is triggered when anything in quote is new.
         * A better getQuote function should filter API response with only the
         * property that we care.
         * That way this calculation function is only triggered when quote that we care
         * is updated, and we can always return a new object instead of doing compare
         * like below.
         */

        // Return a new object if holding changed to trigger props update.
        return isEqual(holding, newHolding) ? holding : newHolding;
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
    return createDeepEqualSelector([getHolding, getQuote], calculateHoldingPerformance);
};

export const getHoldingsPerformance = createDeepEqualSelector([getHoldings, getQuotes], (holdings, quotes) => {
    return holdings.map(holding => {
        return calculateHoldingPerformance(holding, quotes[holding.symbol]);
    });
});
