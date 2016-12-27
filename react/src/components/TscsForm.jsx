import React, { PropTypes } from 'react';

import { Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

class TscsForm extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        isFetching: PropTypes.bool.isRequired
    };

    state = {
        type: 'buy',
        symbol: '',
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

    render() {
        return (
            <Form inline>
                <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Select</ControlLabel>
                    {' '}
                    <FormControl componentClass="select" placeholder="select" name="type" value={this.state.type} onChange={this.handleInputChange}>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                    </FormControl>
                </FormGroup>
                {' '}
                <FormGroup controlId="formInlineSymbol">
                    <ControlLabel>Symbol</ControlLabel>
                    {' '}
                    <FormControl type="text" placeholder="Symbol" name="symbol" value={this.state.symbol} onChange={this.handleInputChange}/>
                </FormGroup>
                {' '}
                <FormGroup controlId="formInlineDate">
                    <ControlLabel>Date</ControlLabel>
                    {' '}
                    <FormControl type="date" name="date" value={this.state.date} onChange={this.handleInputChange}/>
                </FormGroup>
                {' '}
                <FormGroup controlId="formInlineShares">
                    <ControlLabel>Shares</ControlLabel>
                    {' '}
                    <FormControl type="number" name="shares" value={this.state.shares} onChange={this.handleInputChange}/>
                </FormGroup>
                {' '}
                <FormGroup controlId="formInlinePrice">
                    <ControlLabel>Price</ControlLabel>
                    {' '}
                    <FormControl type="number" name="price" value={this.state.price} onChange={this.handleInputChange}/>
                </FormGroup>
                {' '}
                <FormGroup controlId="formInlineCommission">
                    <ControlLabel>Commission</ControlLabel>
                    {' '}
                    <FormControl type="number" name="commission" value={this.state.commission} onChange={this.handleInputChange}/>
                </FormGroup>
                {' '}
                <FormGroup controlId="formInlineNotes">
                    <ControlLabel>Notes</ControlLabel>
                    {' '}
                    <FormControl type="text" name="notes" value={this.state.notes} onChange={this.handleInputChange}/>
                </FormGroup>
                <Button bsStyle="primary" onClick={this.handleSubmit} disabled={this.props.isFetching}>
                    Save
                </Button>
            </Form>
        );
    }
}

export default TscsForm;