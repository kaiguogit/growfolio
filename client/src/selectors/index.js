import {
    createSelectorWithDependencies as createSelector,
    registerSelectors
} from 'reselect-tools';
import { generateAccountHoldingsMap,
         calculateHoldingPerformance,
         calculateTotalPerformance
} from './holdingCalculator';

/**
 * Input selectors
 * input selectors pluck information from state. It also takes props
 * for addtional information.
 */

export const getTscs = state => state.tscs.items;
export const getQuotes = state => state.quotes.items;
export const getQuote = (state, props) => state.quotes.items[props.symbol];
export const getRealTimeQuotes = (state) => state.quotes.realTimeitems;
export const getRealTimeQuote = (state, props) => state.quotes.realTimeitems[props.symbol];
export const getSymbolFromProps = (state, props) => props && props.symbol;
export const getDisplayAccount = (state) => state.portfolio.displayAccount;
export const getDisplayCurrency = state => state.portfolio.displayCurrency;
export const getBalance = state => state.balance;
export const getRealTimeRate = state => state.currency.rate;

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
export const getAccountHoldingsMap = createSelector(
    [getTscs], generateAccountHoldingsMap);

registerSelectors({getAccountHoldingsMap});
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
export const getHoldings = createSelector(
    [getDisplayAccount, getAccountHoldingsMap],
    (account, accountHoldingsMap) => accountHoldingsMap[account] || []
);
registerSelectors({getHoldings});

/**
 * Selector function for 1 holding.
 * @param {object} pass the global state here
 * @param {object} props with props.symbol
 * @param {string} props.symbol Holding's symbol.
 * @param {string} props.account Account name.
 * @return {object} holding
 */
export const getSingleHolding = createSelector(
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
    return createSelector([getSingleHolding, getQuote, getRealTimeQuote, getRealTimeRate], calculateHoldingPerformance);
};

/**
 * Selector function for all holdings with performance.
 * @param {object} pass the global state here
 * @return {Array}: calculated holdings with performance data.
 */
export const getHoldingsPerformance = createSelector(
    [getHoldings, getQuotes, getRealTimeQuotes, getRealTimeRate],
    (holdings, quotes, realTimeQuotes, rates) => {
        return (holdings || []).map(holding => {
            return calculateHoldingPerformance(holding, quotes[holding.symbol], realTimeQuotes[holding.symbol], rates);
        });
    }
);
registerSelectors({getHoldingsPerformance});

/**
 * Selector function for total performance.
 * @param {object} pass the global state here
 * @return {object}: calculated total performance.
 */
export const getTotalPerformance = createSelector([getHoldingsPerformance, getDisplayCurrency], calculateTotalPerformance);
registerSelectors({getTotalPerformance});

export const getBalanceArray = createSelector([getBalance], balance => {
    return Object.keys(balance).map(symbol => ({
        name: symbol,
        y: balance[symbol].percentage
    }));
});
registerSelectors({getBalanceArray});
