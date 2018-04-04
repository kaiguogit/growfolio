import React from 'react';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';

import {Input, FormGroup, Select} from '../shared/index.jsx';

class QuoteForm extends React.Component {
    constructor(props) {
        super(props);
        let base = {
            symbol: '',
            currency: 'CAD',
            price: '',
            change: '',
            changePercent: ''
        };
        if (this.props.quote) {
            this.state = Object.assign(base, props.quote);
        } else {
            this.state = base;
        }

        this.getState = this.getState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    getState() {
        return this.state;
    }

    handleInputChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        let {symbol, currency, price, change, changePercent} = this.state;
        return (
            <form className="tscs-form">
                <FormGroup>
                    <label htmlFor="symbol">Symbol</label>
                    <Input name="symbol" id="symbol"
                        value={symbol} onChange={this.handleInputChange}/>
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
                    <label htmlFor="price">Price</label>
                    <Input type="number" name="price" id="price"
                        value={price} onChange={this.handleInputChange}/>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="change">Change</label>
                    <Input type="number" name="change" id="change"
                        value={change} onChange={this.handleInputChange}/>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="changePercent">Change Percent</label>
                    <Input type="number" name="changePercent" id="changePercent"
                        value={changePercent} onChange={this.handleInputChange}/>
                </FormGroup>
            </form>
        );
    }
}

QuoteForm.propTypes = {
    quote: PropTypes.object
};

export default QuoteForm;