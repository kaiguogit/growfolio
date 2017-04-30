import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/balance';
import isEqual from 'lodash.isequal';

import { getTotalPerformance } from '../../selectors';
import { percentage, currency, redOrGreen } from '../../utils';

class BalanceForm extends React.Component {
    static propTypes = {
        total: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        balance: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        // To be able to type 1.01
        // Save balance to local state and avoid updating it if value is same.
        // This way we can type decimal percentage without being overridden by new props.
        // http://stackoverflow.com/questions/28072727/translating-between-cents-and-dollars-in-html-input-in-react
        this.state = {investAmount: 0, balance: props.balance};
    }

    componentDidMount() {
        this.props.actions.fetchAllocations();
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.balance, nextProps.balance)) {
            this.setState({balance: nextProps.balance});
        }
    }

    handlePercentageChange = e => {
        let newBalance = Object.assign({}, this.state.balance);
        let newHolding = Object.assign({}, newBalance[e.target.name]);
        newHolding.percentage = e.target.value;
        newBalance[e.target.name] = newHolding;
        this.setState({balance: newBalance});
        this.props.actions.updateBalancePercentage({
            symbol: e.target.name,
            percentage: e.target.value
        });
    }

    handleInvestAmountChange = e => {
        this.setState({
            investAmount: + e.target.value
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
                percentage: Math.floor(holding.mkt_value / this.props.total.mkt_value * 10000) / 100
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
        const { total } = this.props;
        const balance = this.state.balance;
        const difference = (holding) => {
            let result = 0;
            let totalValue = total.mkt_value + this.state.investAmount;
            if (balance[holding.symbol]) {
                result = balance[holding.symbol].percentage / 100 * totalValue - holding.mkt_value;
            }
            return (
                <span style={redOrGreen(result)}>
                    {currency(2)(result)}
                </span>
            );
        };
        // Make bootstrap table fit content
        // http://stackoverflow.com/questions/10687306/why-do-twitter-bootstrap-tables-always-have-100-width
        return (
            <div>
                <div className="row">
                    <form className="form-inline">
                        <label>Amount to Invest</label>
                        <input className="form-control ml-2" type="number"
                            defaultValue={0}
                            onChange={this.handleInvestAmountChange}/>
                    </form>
                </div>
                <table className="table table-striped table-bordered table-condensed table-sm">
                    <thead>
                        <tr>
                            <th>
                                Symbol
                            </th>
                            <th>
                                <span className="mr-2">Label</span>
                                <button className="btn btn-warning btn-sm" onClick={this.resetAllLabel}>Reset</button>
                            </th>
                            <th>
                                <span className="mr-2">Value</span>
                            </th>
                            <th>
                                <span className="mr-2">Percentage</span>
                                <button className="btn btn-info btn-sm" onClick={this.cloneAllPercentage}>Clone</button>
                            </th>
                            <th>
                                <span className="mr-2">Target</span>
                                <button className="btn btn-warning btn-sm" onClick={this.resetAllPercentage}>Reset</button>
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
                                    <td>{currency(2)(holding.mkt_value)}</td>
                                    <td>
                                        <div className="row no-gutters">
                                            <div className="col-6">
                                                <span className="align-middle">{percentage(holding.mkt_value / total.mkt_value)}</span>
                                            </div>
                                            <div className="col-6">
                                                <button className="btn btn-info btn-sm" name={holding.symbol} value={holding.mkt_value / total.mkt_value * 100} onClick={this.handlePercentageChange}>
                                                Clone
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            type="text"
                                            name={holding.symbol}
                                            value={balance[holding.symbol] && balance[holding.symbol].percentage}
                                            placeholder="%"
                                            onChange={this.handlePercentageChange}
                                        />
                                    </td>
                                    <td>
                                        {difference(holding)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <button className="btn btn-primary" onClick={this.saveBalance}>Save Balance</button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const total = getTotalPerformance(state);
    const filteredHoldings = total.holdings.slice(0).filter(holding => holding.mkt_value > 0);
    total.holdings = filteredHoldings;
    return {
        total: total,
        balance: state.balance
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BalanceForm);