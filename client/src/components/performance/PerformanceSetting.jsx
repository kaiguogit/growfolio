import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as portfolioActions from '../../actions/portfolio';
import * as tscsActions from '../../actions/tscs';

import CurrencySelector from './CurrencySelector.jsx';
import AccountSelector from './AccountSelector.jsx';
import DisplayDateRange from './DisplayDateRange.jsx';
import {CheckBox} from '../shared/index.jsx';
import FilterSelector from './FilterSelector.jsx';

const GoBackButton = withRouter(({ history }) => {
    const onClick = () => {
        history.goBack();
    };

    return (
        <div>
            <button onClick={onClick}>
                <i className="fa fa-arrow-left fa-lg" aria-hidden="true"/>
                <span>Go back</span>
            </button>
        </div>
    );
});

class PerformanceSetting extends React.Component {

    setShow0ShareHoldings(e) {
        this.props.portfolioActions.setShowZeroShareHolding(e.target.checked);
    }
    setTscGrouping(e) {
        this.props.tscsActions.setTscGrouping(e.target.checked);
    }

    render() {
        return (
            <div className="card">
                <div className="card-block">
                    <CurrencySelector/>
                    <AccountSelector/>
                    <div>
                        <CheckBox
                            title="Show 0-share holdings"
                            onChange={this.setShow0ShareHoldings.bind(this)}
                            checked={this.props.showZeroShareHolding}/>
                    </div>
                    <DisplayDateRange/>
                    <FilterSelector/>
                    <div>
                        <CheckBox
                            title="Group Transactions by symbol"
                            onChange={this.setTscGrouping.bind(this)}
                            checked={this.props.tscGrouping}/>
                    </div>
                    <GoBackButton/>
                </div>
            </div>
        );
    }
}

PerformanceSetting.propTypes = {
    showZeroShareHolding: PropTypes.bool.isRequired,
    tscGrouping: PropTypes.bool.isRequired,
    portfolioActions: PropTypes.object.isRequired,
    tscsActions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    showZeroShareHolding: state.portfolio.showZeroShareHolding,
    tscGrouping: state.tscs.grouping
});

const mapDispatchToProps = dispatch => ({
    portfolioActions: bindActionCreators(portfolioActions, dispatch),
    tscsActions: bindActionCreators(tscsActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceSetting);


