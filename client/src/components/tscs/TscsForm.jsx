import React from 'react';
import PropTypes from 'prop-types';

import SymbolAutoComplete from '../SymbolAutoComplete.jsx';
import {Input, FormGroup, Select} from '../shared/index.jsx';

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
        let {type, symbol, currency, shares, price, commission, notes} = this.state;
        return (
            <div>
                <div className="row no-gutters">
                    <FormGroup className="col-sm-6 col-md-3 pr-2">
                        <label htmlFor="date">Symbol</label>
                        <SymbolAutoComplete
                            value={symbol}
                            onChange={this.handleSymbolChange}
                        />
                    </FormGroup>
                    <FormGroup className="col-sm-6 col-md-auto pr-2">
                        <label htmlFor="date">Date</label>
                        <Input type="date" name="date" id="date"
                            onChange={this.handleInputChange}/>
                    </FormGroup>
                    <FormGroup className="col-sm-6 col-md pr-2">
                        <label htmlFor="type">Type</label>
                        <Select name="type" id="type"
                            value={type}
                            onChange={this.handleInputChange}>
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                            <option value="dividend">Dividend</option>
                        </Select>
                    </FormGroup>
                    <FormGroup className="col-sm-6 col-md-auto pr-1">
                        <label htmlFor="currency">Currency</label>
                        <Select placeholder="select" name="currency" id="currency"
                            value={currency}
                            onChange={this.handleInputChange}>
                            <option value="CAD">CAD</option>
                            <option value="USD">USD</option>
                        </Select>
                    </FormGroup>
                    <FormGroup className="col-sm-6 col-md pr-2">
                        <label htmlFor="shares">Shares</label>
                        <Input type="number" name="shares" id="shares"
                            value={shares} onChange={this.handleInputChange}/>
                    </FormGroup>
                    <FormGroup className="col-sm-6 col-md pr-2">
                        <label htmlFor="price">Price</label>
                        <Input type="number" name="price" id="price"
                            value={price} onChange={this.handleInputChange}/>
                    </FormGroup>
                    <FormGroup className="col-sm-6 col-md pr-2">
                        <label htmlFor="commission">Commission</label>
                        <Input type="number" name="commission" id="commission"
                            value={commission} onChange={this.handleInputChange}/>
                    </FormGroup>
                    <FormGroup className="col-sm-6 col-md pr-2">
                        <label htmlFor="notes">Notes</label>
                        <Input type="text" name="notes" id="notes"
                            value={notes} onChange={this.handleInputChange}/>
                    </FormGroup>
                </div>
                <button role="button" className="btn btn-primary" onClick={this.handleSubmit} disabled={this.props.isFetching}>
                    Save
                </button>
            </div>
        );
    }
}

export default TscsForm;