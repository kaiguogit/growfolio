import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/balance';

import { getTotalPerformance } from '../../selectors';
import { Table } from 'react-bootstrap';
import { percentage } from '../../utils';

class BalanceForm extends React.Component {
    static propTypes = {
        total: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        balance: PropTypes.object.isRequired,
    }

    handleChange = e => {
        this.props.actions.updateBalanceAllocation({
            symbol: e.target.name,
            percentage: e.target.value
        });
    }

    render() {
        const { total } = this.props;
        return (
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Current Percentage</th>
                        <th>Target Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {total.holdings.map(holding => {
                        return (
                            <tr key={holding.symbol}>
                                <td>{holding.symbol}</td>
                                <td>{percentage(holding.mkt_value / total.mkt_value)}</td>
                                <td>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name={holding.symbol}
                                        placeholder="%"
                                        onChange={this.handleChange}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }
}

const mapStateToProps = state => ({
    total: getTotalPerformance(state),
    balance: state.balance
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BalanceForm);