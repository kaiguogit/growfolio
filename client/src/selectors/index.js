
import { generateAccountsMap,
         calculateHoldingPerformance,
         calculateTotalPerformance,
         calculateTotalCashTscs
} from './holdingCalculator';
import {makeSafe} from '../utils';
import {lastWeekDay} from '../../../utils/time';
import {getLatestQuote, getLatestQuotes, findLatestDate} from './quoteSelector';
import {createSelector, registerSelectors} from './selectorsUtils';

/**
 * Input selectors
 * input selectors pluck information from state. It also takes props
 * for addtional information.
 */

export const getTscs = state => state.tscs.items;
export const getSymbolFromProps = (state, props) => props && props.symbol;
export const getDisplayAccount = (state) => state.portfolio.displayAccount;
export const getDisplayCurrency = state => state.portfolio.displayCurrency;
export const getShowZeroShareHolding = state => state.portfolio.showZeroShareHolding;
export const getStartDate = state => state.portfolio.startDate;
export const getEndDate = state => state.portfolio.endDate;
export const getTscTypeFilter = state => state.tscs.filter.type;
export const getBalance = state => state.balance;
export const getExchangeRates = state => state.currency.data;
export const getLatestExchangeRate = createSelector([getExchangeRates], data => {
    const latestDate = findLatestDate(data, lastWeekDay().format('YYYY-MM-DD'));
    const latestRate = data[latestDate];
    return latestRate || 1;
});

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
export const getAccountsMap = createSelector(
    [getTscs, getExchangeRates], generateAccountsMap);
registerSelectors({getAccountsMap});
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
    [getDisplayAccount, getAccountsMap],
    makeSafe((account, accountsMap) => accountsMap[account].holdings)
);
registerSelectors({getHoldings});

export const getCash = createSelector(
    [getDisplayAccount, getAccountsMap],
    makeSafe((account, accountsMap) => accountsMap[account].cash)
);

export const getValidCashTscs = createSelector(
    [getDisplayAccount, getAccountsMap, getStartDate, getEndDate],
    makeSafe((account, accountsMap, startDate, endDate) => accountsMap[account].getCashTransactions(startDate, endDate))
);

export const getValidCashTscsTotal = createSelector([getValidCashTscs], makeSafe(calculateTotalCashTscs));

export const getHoldingsAfterZeroShareFilter = createSelector(
    [getHoldings, getShowZeroShareHolding, getDisplayCurrency],
    makeSafe((holdings, showZeroShareHolding, displayCurrency) => {
        if (!showZeroShareHolding) {
            return holdings.filter(holding => holding.shares[displayCurrency]);
        }
        return holdings;
    })
);

export const getHoldingsWithValidTscs = createSelector(
    [getHoldingsAfterZeroShareFilter, getStartDate, getEndDate, getTscTypeFilter],
    makeSafe((holdings, startDate, endDate, typeFilter) => {
        return holdings.filter(holding => holding.hasValidTscs(startDate, endDate, typeFilter));
    })
);

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
    makeSafe((holdings, symbol) => (holdings || []).find(x => x.symbol === symbol))
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
    return createSelector([getSingleHolding, getLatestQuote, getLatestExchangeRate], calculateHoldingPerformance);
};

/**
 * Selector function for all holdings with performance.
 * @param {object} pass the global state here
 * @return {Array}: calculated holdings with performance data.
 */
export const getHoldingsPerformance = createSelector(
    [getHoldings, getLatestQuotes, getLatestExchangeRate],
    makeSafe((holdings, quotes, rate) => {
        return (holdings || []).map(holding => {
                return calculateHoldingPerformance(holding, quotes[holding.symbol], rate);
        });
    })
);
registerSelectors({getHoldingsPerformance});

/**
 * Selector function for total performance.
 * @param {object} pass the global state here
 * @return {object}: calculated total performance.
 */
export const getTotalPerformance = createSelector([getHoldingsPerformance, getDisplayCurrency], calculateTotalPerformance);
registerSelectors({getTotalPerformance});

export const getBalanceArray = createSelector([getBalance], makeSafe(balance => {
    return Object.keys(balance).map(symbol => ({
        name: symbol,
        y: balance[symbol].percentage
    }));
}));
registerSelectors({getBalanceArray});
