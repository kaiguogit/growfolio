import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/portfolio';
import { Select } from '../shared/index.jsx';

class CurrencySelector extends React.Component {
    static propTypes = {
        displayCurrency: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired
    }

    handleSelectCurrency = e => {
        this.props.actions.selectDisplayCurrency(e.target.value);
    }

    render() {
        return (
            <div>
                <div className="d-inline-block mr-2">
                    <label htmlFor="display-currency">Display Currency</label>
                </div>
                <div className="d-inline-block">
                <Select id="display-currency" value={this.props.displayCurrency} onChange={this.handleSelectCurrency}>
                    <option value="CAD">CAD</option>
                    <option value="USD">USD</option>
                </Select>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    displayCurrency: state.portfolio.displayCurrency
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrencySelector);