import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/portfolio';

import CurrencySelector from './CurrencySelector.jsx';
import AccountSelector from './AccountSelector.jsx';
import {CheckBox} from '../shared/index.jsx';

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
    render() {
        return (
            <div className="card">
                <div className="card-block">
                    <CurrencySelector/>
                    <AccountSelector/>
                    <div>
                        <CheckBox
                            title="Show 0-share holdings"
                            onChange={this.props.actions.setShowZeroShareHolding}
                            checked={this.props.showZeroShareHolding}/>
                    </div>
                    <GoBackButton/>
                </div>
            </div>
        );
    }
}

PerformanceSetting.propTypes = {
    showZeroShareHolding: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    showZeroShareHolding: state.portfolio.showZeroShareHolding
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceSetting);


