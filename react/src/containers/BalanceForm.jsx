import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { getTotalPerformance } from '../selectors';
import { Table } from 'react-bootstrap';
import { percentage } from '../utils';

class BalanceForm extends React.Component {
    static propTypes = {
        total: PropTypes.object.isRequired
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
                                        name="target-percentage"
                                        placeholder="%"
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
    total: getTotalPerformance(state)
});

export default connect(mapStateToProps)(BalanceForm);