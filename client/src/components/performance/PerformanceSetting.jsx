import React from 'react';
import PropTypes from 'prop-types';

import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/portfolio';

import CurrencySelector from './CurrencySelector.jsx';
import {CheckBox} from '../shared/index.jsx';

const onClick = () => {
    browserHistory.push('/portfolio');
};

const GoBackButton = () => (
    <div>
        <button type="button" className="btn btn-outline-primary" onClick={onClick}>
            <i className="fa fa-arrow-left fa-lg" aria-hidden="true"/>
            {' '}
            Go back
        </button>
    </div>
);

class PerformanceSetting extends React.Component {
    static propTypes = {
        showZeroShareHolding: PropTypes.bool.isRequired,
        actions: PropTypes.object.isRequired
    }

    render() {
        return (
            <div className="card">
                <div className="card-block">
                    <CurrencySelector/>
                    <div>
                        <CheckBox
                            title="Show 0-share holdings"
                            onChange={this.props.actions.showZeroShareHolding}
                            checked={this.props.showZeroShareHolding}/>
                    </div>
                    <GoBackButton/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    showZeroShareHolding: state.portfolio.showZeroShareHolding
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PerformanceSetting);


