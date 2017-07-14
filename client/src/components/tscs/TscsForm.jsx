import React from 'react';

// import SymbolAutoComplete from '../SymbolAutoComplete.jsx';
import SymbolAutoComplete from './SymbolAutoComplete.jsx';
import {Input, FormGroup, Select} from '../shared/index.jsx';

class TscsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'buy',
            name: '',
            symbol: '',
            exch: '',
            currency: 'CAD',
            date: '',
            shares: '',
            amount: '',
            totalOrPerShare: true,
            commission: '',
            notes: ''
        };
        this.getState = this.getState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSymbolChange = this.handleSymbolChange.bind(this);
        this.handleTotalOrPerShareChange = this.handleTotalOrPerShareChange.bind(this);
    }

    getState() {
        let temp = Object.assign({}, this.state);
        temp.date = new Date(this.state.date);
        return temp;
    }

    handleInputChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleTotalOrPerShareChange(e) {
        this.setState({[e.target.name]: e.target.value === 'true'});
    }

    handleSymbolChange(data) {
        let {symbol, name, exch} = data;
        this.setState({symbol, name, exch});
    }

    render() {
        let {type, currency, shares, amount, commission, notes, totalOrPerShare} = this.state;
        return (
            <form className="tscs-form">
                <FormGroup>
                    <label htmlFor="symbol">Symbol</label>
                    <SymbolAutoComplete onSelected={this.handleSymbolChange}/>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="date">Date</label>
                    <Input type="date" name="date" id="date"
                        onChange={this.handleInputChange}/>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="type">Type</label>
                    <Select name="type" id="type"
                        value={type}
                        onChange={this.handleInputChange}>
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                        <option value="dividend">Dividend</option>
                    </Select>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="currency">Currency</label>
                    <Select placeholder="select" name="currency" id="currency"
                        value={currency}
                        onChange={this.handleInputChange}>
                        <option value="CAD">CAD</option>
                        <option value="USD">USD</option>
                    </Select>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="shares">Shares</label>
                    <Input type="number" name="shares" id="shares"
                        value={shares} onChange={this.handleInputChange}/>
                </FormGroup>

                <FormGroup>
                    <label htmlFor="amount">Amount</label>
                    <div className="row no-gutters">
                        <div className="col-8">
                            <Input type="number" name="amount" id="amount"
                                value={amount} onChange={this.handleInputChange}/>
                        </div>
                        <div className="col-4">
                            <Select placeholder="select" name="totalOrPerShare" id="totalOrPerShare"
                                value={totalOrPerShare ? "true" : "false"}
                                onChange={this.handleTotalOrPerShareChange}>
                                <option value="true">Total</option>
                                <option value="false">Per Share</option>
                            </Select>
                        </div>
                    </div>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="commission">Commission</label>
                    <Input type="number" name="commission" id="commission"
                        value={commission} onChange={this.handleInputChange}/>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="notes">Notes</label>
                    <Input type="text" name="notes" id="notes"
                        value={notes} onChange={this.handleInputChange}/>
                </FormGroup>
            </form>
        );
    }
}

export default TscsForm;