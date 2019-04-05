import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// import SymbolAutoComplete from '../SymbolAutoComplete.jsx';
import SymbolAutoComplete from './SymbolAutoComplete.jsx';
import {Input, FormGroup, Select} from '../shared/index.jsx';
import {DollarValue} from '../../selectors/transaction';

class TscsForm extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.tsc) {
            let state = Object.assign({}, props.tsc);
            let currency = this.props.tsc.currency;
            Object.keys(state).forEach(key => {
                if (state[key] instanceof DollarValue) {
                    state[key] = state[key][currency];
                }
            });
            this.state = state;
        } else {
            this.state = {
                type: 'buy',
                name: '',
                symbol: '',
                exch: '',
                currency: 'CAD',
                date: moment(),
                shares: '',
                amount: '',
                returnOfCapital: '',
                capitalGain: '',
                account: '',
                totalOrPerShare: true,
                commission: '',
                notes: ''
            };
        }

        this.getState = this.getState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSymbolChange = this.handleSymbolChange.bind(this);
        this.handleTotalOrPerShareChange = this.handleTotalOrPerShareChange.bind(this);
    }

    getState() {
        return this.state;
    }

    handleInputChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleDateChange(date) {
        this.setState({date: moment(date)});
    }

    handleTotalOrPerShareChange(e) {
        this.setState({[e.target.name]: e.target.value === 'true'});
    }

    handleSymbolSuggestionSelected(data) {
        let {symbol, name, exch} = data;
        this.setState({symbol, name, exch});
    }

    handleSymbolChange(symbol) {
        this.setState({symbol});
    }

    render() {
        let {type, name, currency, exch, shares, amount, account, commission, notes, totalOrPerShare,
            returnOfCapital, capitalGain} = this.state;
        let {tsc} = this.props;
        return (
            <form className="tscs-form">
                <FormGroup>
                    <label htmlFor="symbol">Symbol</label>
                    <SymbolAutoComplete data={tsc}
                        onSelected={this.handleSymbolSuggestionSelected.bind(this)}
                        onChange={this.handleSymbolChange.bind(this)}/>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="name">Name</label>
                    <Input name="name" id="name"
                        value={name} onChange={this.handleInputChange}/>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="exch">Exchange Market</label>
                    <Input name="exch" id="exch"
                        value={exch} onChange={this.handleInputChange}/>
                </FormGroup>
                <FormGroup>
                    <label htmlFor="date">Date</label>
                    <div>
                        <DatePicker
                            selected={this.state.date.toDate()}
                            onChange={this.handleDateChange}
                            className="form-control"
                            showYearDropdown
                            yearDropdownItemNumber={3}
                            showMonthDropdown
                            scrollableYearDropdown
                        />
                    </div>
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
                    <label htmlFor="account">Account</label>
                    <Select name="account" id="account"
                        value={account}
                        onChange={this.handleInputChange}>
                        <option disabled value="">-- Select an account --</option>
                        <option value="kai-tfsa">Kai TFSA</option>
                        <option value="kai-rrsp">Kai RRSP</option>
                        <option value="kai-spouse-rrsp">Kai Spouse RRSP</option>
                        <option value="kai-non-registered">Kai Non Registered</option>
                        <option value="crystal-tfsa">Crystal TFSA</option>
                        <option value="crystal-rrsp">Crystal RRSP</option>
                        <option value="crystal-non-registered">Crystal Non Registered</option>
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
                {this.state.type === 'dividend' &&
                <FormGroup>
                    <label htmlFor="returnofcapital">Return of Capital</label>
                    <Input type="number" name="returnOfCapital" id="returnofcapital"
                        value={returnOfCapital} onChange={this.handleInputChange}/>
                </FormGroup>
                }
                {this.state.type === 'dividend' &&
                <FormGroup>
                    <label htmlFor="capitalgain">Capital Gain</label>
                    <Input type="number" name="capitalGain" id="capitalgain"
                        value={capitalGain} onChange={this.handleInputChange}/>
                </FormGroup>
                }
                <FormGroup>
                    <label htmlFor="notes">Notes</label>
                    <Input type="text" name="notes" id="notes"
                        value={notes} onChange={this.handleInputChange}/>
                </FormGroup>
            </form>
        );
    }
}

TscsForm.propTypes = {
    tsc: PropTypes.object
};

export default TscsForm;