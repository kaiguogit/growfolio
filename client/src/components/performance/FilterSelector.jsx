import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/tscs';
import {Select} from '../shared/index.jsx';

class FilterSelector extends React.Component {

    handleInputChange(event) {
        this.props.actions.setTscTypeFilter(event.target.value);
    }
    render() {
        return (
            <React.Fragment>
                <div className="d-inline-block mr-2">
                    <label htmlFor="display-currency">Transaction Type</label>
                </div>
                <div className="d-inline-block">
                    <Select name="type" id="type"
                        value={this.props.type}
                        onChange={this.handleInputChange.bind(this)}>
                        <option value=""/>
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                        <option value="dividend">Dividend</option>
                        <option value="deposit">Deposit</option>
                        <option value="withdraw">Withdraw</option>
                    </Select>
                </div>
            </React.Fragment>
        );
    }
}

FilterSelector.propTypes = {
    type: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    type: state.tscs.filter.type
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterSelector);