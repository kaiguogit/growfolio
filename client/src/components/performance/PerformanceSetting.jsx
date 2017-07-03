import React from 'react';
import PropTypes from 'prop-types';

import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/portfolio';

import CurrencySelector from './CurrencySelector.jsx';
import {CheckBox} from '../shared/index.jsx';

// Programmatically navigate using react routerv4
// https://stackoverflow.com/a/42121109
const GoBackButton = withRouter(({ history }) => {
    const onClick = () => {
        history.push('/portfolio');
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


