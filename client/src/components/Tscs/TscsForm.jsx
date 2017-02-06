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
                <div className="row no-gutters">
                    <div className="form-group col-sm-6 col-md-3 pr-2">
                        <label htmlFor="date">Symbol</label>
                        <SymbolAutoComplete
                            value={this.state.symbol}
                            onChange={this.handleSymbolChange}
                        />
                    </div>
                    <div className="form-group col-sm-6 col-md-auto pr-2">
                        <label htmlFor="date">Date</label>
                        <input type="date" className="form-control" id="date"/>
                    </div>
                    <div className="form-group col-sm-6 col-md pr-2">
                        <label htmlFor="type">Type</label>
                        <select className="form-control" name="type" id="type"
                            value={this.state.type}
                            onChange={this.handleInputChange}>
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                            <option value="dividend">Dividend</option>
                        </select>
                    </div>
                    <div className="form-group col-sm-6 col-md-auto pr-1">
                        <label htmlFor="currency">Currency</label>
                        <select className="form-control" placeholder="select" name="currency" id="currency"
                            value={this.state.currency}
                            onChange={this.handleInputChange}>
                            <option value="CAD">CAD</option>
                            <option value="USD">USD</option>
                        </select>
                    </div>
                    <div className="form-group col-sm-6 col-md pr-2">
                        <label htmlFor="shares">Shares</label>
                        <input className="form-control" type="number" name="shares" id="shares"
                            value={this.state.shares} onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group col-sm-6 col-md pr-2">
                        <label htmlFor="price">Price</label>
                        <input className="form-control" type="number" name="price" id="price"
                            value={this.state.price} onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group col-sm-6 col-md pr-2">
                        <label htmlFor="commission">Commission</label>
                        <input className="form-control" type="number" name="commission" id="commission"
                            value={this.state.commission} onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group col-sm-6 col-md pr-2">
                        <label htmlFor="notes">Notes</label>
                        <input className="form-control" type="text" name="notes" id="notes"
                            value={this.state.notes} onChange={this.handleInputChange}/>
                    </div>
                </div>
                <button role="button" className="btn btn-primary" onClick={this.handleSubmit} disabled={this.props.isFetching}>
                    Save
                </button>
            </div>
        );
    }
}

export default TscsForm;