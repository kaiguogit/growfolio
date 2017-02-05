import React, { PropTypes } from 'react';

import SymbolAutoComplete from '../SymbolAutoComplete.jsx';

const styles = {
    symbolWidth: {
        width: '200px'
    },
    numberWidth: {
        width: '100px'
    },
    dateWidth: {
        width: '200px'
    },
    noteWidth: {
        width: 'auto'
    },
    formWidth: {
        width: '80%'
    }
};

class TscsForm extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        isFetching: PropTypes.bool.isRequired
    };

    state = {
        type: 'buy',
        name: '',
        symbol: '',
        exch: '',
        currency: 'CAD',
        date: '',
        shares: '',
        price: '',
        commission: '',
        notes: ''
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let temp = Object.assign({}, this.state);
        temp.date = new Date(this.state.date);
        this.props.onSubmit(temp);
    };

    handleInputChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    handleSymbolChange = data => {
        let {value: symbol, name, exch} = data;
        this.setState({symbol, name, exch});
    };

    render() {
        return (
            <div>
                <Table bordered style={styles.formWidth}>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Currency</th>
                            <th>Shares</th>
                            <th>Price</th>
                            <th>Commission</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div style={styles.symbolWidth}>
                                    <SymbolAutoComplete
                                        value={this.state.symbol}
                                        onChange={this.handleSymbolChange}
                                    />
                                </div>
                            </td>
                            <td>
                                <input className="form-control" style={styles.dateWidth} type="date" name="date" value={this.state.date} onChange={this.handleInputChange}/>
                            </td>
                            <td>
                                <select className="form-control" style={styles.numberWidth} name="type" value={this.state.type} onChange={this.handleInputChange}>
                                    <option value="buy">Buy</option>
                                    <option value="sell">Sell</option>
                                    <option value="dividend">Dividend</option>
                                </select>
                            </td>
                            <td>
                                <select className="form-control" style={styles.numberWidth} placeholder="select" name="currency" value={this.state.currency} onChange={this.handleInputChange}>
                                    <option value="CAD">CAD</option>
                                    <option value="USD">USD</option>
                                </select>
                            </td>
                            <td>
                                <input className="form-control" style={styles.numberWidth} type="number" name="shares" value={this.state.shares} onChange={this.handleInputChange}/>
                            </td>
                            <td>
                                <input className="form-control" style={styles.numberWidth} type="number" name="price" value={this.state.price} onChange={this.handleInputChange}/>
                            </td>
                            <td>
                                <input className="form-control" style={styles.numberWidth} type="number" name="commission" value={this.state.commission} onChange={this.handleInputChange}/>
                            </td>
                            <td>
                                <input className="form-control" style={styles.noteWidth} type="text" name="notes" value={this.state.notes} onChange={this.handleInputChange}/>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Button bsStyle="primary" onClick={this.handleSubmit} disabled={this.props.isFetching}>
                    Save
                </Button>
            </div>

        );
    }
}

export default TscsForm;