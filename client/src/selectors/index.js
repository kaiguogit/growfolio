import { createSelectorCreator, defaultMemoize } from 'reselect';
import { generateAccountHoldingsMap,
         calculateHoldingPerformance,
         calculateTotalPerformance
} from './holdingCalculator';
import isEqual from 'lodash.isequal';

// Memoized selector
// Read more from https://github.com/reactjs/reselect
/**
 * Create a selector function that uses lodash.isequal library to
 * compare new/old input to avoid recalculating
 * @param {Array} array of input selector functions, if input is not
 *     changed, won't run output selector
 * @param {Function} output selector function, process input from input
 *     selectors.
 * @return {SelectorFunction} func The memoized selector function
 *     that will return output selector function's result
 */
export const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual);

/**
 * Input selectors
 * input selectors pluck information from state. It also takes props
 * for addtional information.
 */

export const getTscs = state => state.tscs.items;
export const getQuotes = state => state.quotes.items;
export const getQuote = (state, props) => state.quotes.items[props.symbol];
export const getSymbolFromProps = (state, props) => props && props.symbol;
export const getDisplayAccount = (state) => state.portfolio.displayAccount;
export const getCurrency = state => state.currency.rate;
export const getDisplayCurrency = state => state.portfolio.displayCurrency;
export const getBalance = state => state.balance;


/**
 * Selector function
 * @name SelectorFunction
 * @param {object} state
 * @param {object} props
 * @return {any} calculated output
 * Usage:
 * import { getHoldings } from '../../selectors';
 * const mapStateToProps = state => {
 *     return {
 *         holdings: getHoldings(state),
 *         displayCurrency: state.portfolio.displayCurrency,
 *         showZeroShareHolding: state.portfolio.showZeroShareHolding
 *     };
 * };
 * const mapDispatchToProps = dispatch => {
 *     return {
 *         actions: bindActionCreators(quotesActions, dispatch)
 *     };
 * };
 * export default connect(mapStateToProps, mapDispatchToProps)(Performance);
 */

/**
 * Use holdingCalculator to calculate holdings from transactions.
 * If tscs in state is not 'changed' (value-wise, the object is
 * actually new), it won't recalculate.
 *
 * @param {object} pass the global state here
 * @param {object} props
 * @return {object}: key-value map, key is account, value is holdings array
 */
export const getAccountHoldingsMap = createDeepEqualSelector([getTscs], generateAccountHoldingsMap);

/**
 * Get holdings for single account.
 * Usage.
 * const mapStateToProps = (state, props) => {
 *      return {
 *          holdings: getHoldings(state, props)
 *      }
 * }
 * export default connect(mapStateToProps, mapDispatchToProps)(Portfolio)
 * @param {object} pass the global state here
 * @param {object} props pass component props
   @param {string} props.account Account name.
 * @return {Array}: calculated holdings for the account.
 */
export const getHoldings = createDeepEqualSelector(
    [getDisplayAccount, getAccountHoldingsMap],
    (account, accountHoldingsMap) => accountHoldingsMap[account] || []
);

/**
 * Selector function for 1 holding.
 * @param {object} pass the global state here
 * @param {object} props with props.symbol
 * @param {string} props.symbol Holding's symbol.
 * @param {string} props.account Account name.
 * @return {object} holding
 */
export const getSingleHolding = createDeepEqualSelector(
    [getHoldings, getSymbolFromProps],
    (holdings, symbol) => (holdings || []).find(x => x.symbol === symbol)
);

/**
 * Nest selector to further calculate holding gains based on Real Time Quotes
 * If holding is not changed, holdings based on transaction won't have to be calculated.
 *
 * This is a make function to generate unique selector for 1 holding, so that
 * each row can be updated when its holding changed without triggering other
 * row's selector function.
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
    return createDeepEqualSelector([getSingleHolding, getQuote, getCurrency, getDisplayCurrency], calculateHoldingPerformance);
};

/**
 * Selector function for all holdings with performance.
 * @param {object} pass the global state here
 * @return {Array}: calculated holdings with performance data.
 */
export const getHoldingsPerformance = createDeepEqualSelector(
    [getHoldings, getQuotes, getCurrency, getDisplayCurrency],
    (holdings, quotes, currencyRates, displayCurrency) => {
        return (holdings || []).map(holding => {
            return calculateHoldingPerformance(holding, quotes[holding.symbol], currencyRates, displayCurrency);
        });
    }
);

/**
 * Selector function for total performance.
 * @param {object} pass the global state here
 * @return {object}: calculated total performance.
 */
export const getTotalPerformance = createDeepEqualSelector([getHoldingsPerformance], calculateTotalPerformance);

export const getBalanceArray = createDeepEqualSelector([getBalance], balance => {
    return Object.keys(balance).map(symbol => ({
        name: symbol,
        y: balance[symbol].percentage
    }));
});