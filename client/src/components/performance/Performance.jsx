import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as quotesActions from '../../actions/quotes';
import isEqual from 'lodash.isequal';
import { getHoldings } from '../../selectors';
import PerformanceTable from './PerformanceTable.jsx';
import SummaryBar from './SummaryBar.jsx';

class Performance extends React.Component {

    componentDidUpdate(prevProps) {
        //Only refresh quotes when holdings or display currency changed
        if (!(isEqual(prevProps.holdings, this.props.holdings) &&
            prevProps.displayCurrency === this.props.displayCurrency)) {
            this.props.actions.refreshQuotes();
        }
    }

    render() {
        let { holdings, showZeroShareHolding } = this.props;
        // Hide holding with 0 share.
        if (!showZeroShareHolding) {
            holdings = holdings.filter(holding => holding.shares);
        }

        return(
            <div>
                <SummaryBar/>
                <PerformanceTable symbols={holdings.map(x => x.symbol)}/>
            </div>
        );
    }
}

Performance.propTypes = {
    holdings: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    displayCurrency: PropTypes.string.isRequired,
    showZeroShareHolding: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
    return {
        holdings: getHoldings(state),
        displayCurrency: state.portfolio.displayCurrency,
        showZeroShareHolding: state.portfolio.showZeroShareHolding
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(quotesActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Performance);