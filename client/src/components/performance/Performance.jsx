import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as quotesActions from '../../actions/quotes';
import { getHoldings } from '../../selectors';
import PerformanceTable from './PerformanceTable.jsx';
import SummaryBar from './SummaryBar.jsx';

class Performance extends React.Component {

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
    showZeroShareHolding: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
    return {
        holdings: getHoldings(state),
        showZeroShareHolding: state.portfolio.showZeroShareHolding
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(quotesActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Performance);