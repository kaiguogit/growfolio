import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/balance';

import { getTotalPerformance } from '../../selectors';
import { Table, Button } from 'react-bootstrap';
import { percentage, currency } from '../../utils';

class BalanceForm extends React.Component {
    static propTypes = {
        total: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        balance: PropTypes.object.isRequired,
    }

    componentDidMount() {
        this.props.actions.fetchAllocations();
    }

    handlePercentageChange = e => {
        this.props.actions.updateBalancePercentage({
            symbol: e.target.name,
            percentage: e.target.value
        });
    }

    handleLabelChange = e => {
        this.props.actions.updateBalanceLabel({
            symbol: e.target.name,
            label: e.target.value
        });
    }

    cloneAllPercentage = () => {
        this.props.total.holdings.forEach(holding => {
            this.props.actions.updateBalancePercentage({
                symbol: holding.symbol,
                percentage: holding.mkt_value / this.props.total.mkt_value * 100
            });
        });
    }

    resetAllLabel = () => {
        this.props.total.holdings.forEach(holding => {
            this.props.actions.updateBalanceLabel({
                symbol: holding.symbol,
                label: ''
            });
        });
    }

    resetAllPercentage = () => {
        this.props.total.holdings.forEach(holding => {
            this.props.actions.updateBalancePercentage({
                symbol: holding.symbol,
                percentage: 0
            });
        });
    }

    renderLabelSelector = (symbol) => {
        let label = '';
        let holding = this.props.balance[symbol];
        if (holding && holding.label) {
            label = holding.label;
        }
        return (
            <select className="form-control" name={symbol} value={label} onChange={this.handleLabelChange}>
                <option>{''}</option>
                <option>US Equity</option>
                <option>Canada Equity</option>
                <option>Emerging Equity</option>
                <option>International Equity</option>
                <option>Bond</option>
                <option>Preferred</option>
                <option>Real Return</option>
                <option>Fix Income</option>
                <option>Growth</option>
            </select>
        );
    }

    saveBalance = () => {
        this.props.actions.createAllocations(this.props.balance);
    }

    render() {
        const { total, balance } = this.props;
        // Make bootstrap table fit content
        // http://stackoverflow.com/questions/10687306/why-do-twitter-bootstrap-tables-always-have-100-width
        return (
            <div>
                <Table bordered hover style={{width: 'auto', font: '5px'}}>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Label
                                {' '}
                                <Button onClick={this.resetAllLabel}>Reset</Button>
                            </th>
                            <th>Current
                                {' '}
                                <Button onClick={this.cloneAllPercentage}>Clone</Button>
                            </th>
                            <th>Target
                                {' '}
                                <Button onClick={this.resetAllPercentage}>Reset</Button>
                            </th>
                            <th>Difference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {total.holdings.map(holding => {
                            return (
                                <tr key={holding.symbol}>
                                    <td>{holding.symbol}</td>
                                    <td>{this.renderLabelSelector(holding.symbol)}</td>
                                    <td>{percentage(holding.mkt_value / total.mkt_value)}
                                        {' '}
                                        <Button name={holding.symbol} value={holding.mkt_value / total.mkt_value * 100} onClick={this.handlePercentageChange}>
                                        Clone
                                        </Button>
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            type="number"
                                            name={holding.symbol}
                                            value={balance[holding.symbol] && balance[holding.symbol].percentage || 0}
                                            placeholder="%"
                                            onChange={this.handlePercentageChange}
                                        />
                                    </td>
                                    <td>{balance[holding.symbol] && percentage((balance[holding.symbol].percentage / 100 - holding.mkt_value / total.mkt_value))}
                                        {' '}
                                        {balance[holding.symbol] && currency((balance[holding.symbol].percentage / 100 - holding.mkt_value / total.mkt_value) * total.mkt_value)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <Button bsStyle="primary" onClick={this.saveBalance}>Save Balance</Button>
            </div>
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