import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getHoldingsWithValidTscs, getAllTransactionsWithBalanceInBetween, getDisplayCurrency, getValidCashTscs, getValidCashTscsTotal } from '../../selectors';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/tscs';

import TscsTable from './TscsTable.jsx';
import DeleteTscModal from './DeleteTscModal.jsx';

class TscsContainer extends React.Component {
    render() {
        let { isFetching, holdings, allTscs, displayCurrency, actions, startDate,
            endDate, cashTscs, totalCashTscs, typeFilter, collapse, tscGrouping} = this.props;
        const isEmpty = !holdings.length && !cashTscs.length;

        return (
            <div>
                {isEmpty
                  ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                  : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                      <TscsTable holdings={holdings}
                        allTscs={allTscs}
                        displayCurrency={displayCurrency}
                        setCollapse={actions.setOneCollapse}
                        typeFilter={typeFilter}
                        cashTscs={cashTscs}
                        totalCashTscs={totalCashTscs}
                        startDate={startDate}
                        endDate={endDate}
                        collapse={collapse}
                        tscGrouping={tscGrouping}/>
                    </div>
                }
                <DeleteTscModal/>
            </div>
        );
    }
}

TscsContainer.propTypes = {
    holdings: PropTypes.array.isRequired,
    allTscs: PropTypes.array.isRequired,
    cashTscs: PropTypes.array.isRequired,
    totalCashTscs: PropTypes.object.isRequired,
    typeFilter: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    displayCurrency: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    collapse: PropTypes.object.isRequired,
    tscGrouping: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
    return {
        holdings: getHoldingsWithValidTscs(state),
        allTscs: getAllTransactionsWithBalanceInBetween(state),
        typeFilter: state.tscs.filter.type,
        cashTscs: getValidCashTscs(state),
        totalCashTscs: getValidCashTscsTotal(state),
        isFetching: state.tscs.isFetching,
        displayCurrency: getDisplayCurrency(state),
        startDate: state.portfolio.startDate,
        endDate: state.portfolio.endDate,
        collapse: state.tscs.collapse,
        tscGrouping: state.tscs.grouping
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TscsContainer);
