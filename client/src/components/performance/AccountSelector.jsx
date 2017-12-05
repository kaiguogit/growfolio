import React from 'react';
import PropTypes from 'prop-types';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/portfolio';
import { Select } from '../shared/index.jsx';
import ACCOUNT from '../../constants/accounts';

class AccountSelector extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectAccount = this.handleSelectAccount.bind(this);
    }

    handleSelectAccount(e) {
        this.props.actions.selectDisplayAccount(e.target.value);
    }

    render() {
        return (
            <div>
                <div className="d-inline-block mr-2">
                    <label htmlFor="display-currency">Display Account</label>
                </div>
                <div className="d-inline-block">
                <Select id="display-currency" value={this.props.displayAccount} onChange={this.handleSelectAccount}>
                    {
                        ACCOUNT.map((account) => {
                            return (
                                <option key={account} value={account}>{account}</option>
                            );
                        })
                    }
                </Select>
                </div>
            </div>
        );
    }
}

AccountSelector.propTypes = {
    displayAccount: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    displayAccount: state.portfolio.displayAccount
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountSelector);