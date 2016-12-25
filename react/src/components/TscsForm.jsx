import React, {PropTypes} from 'react';

class TscsForm extends React.Component {

    static propTypes = {
        onSubmit: PropTypes.func.isRequired
    };

    state = {
        type: '',
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
            <form className="form form-inline" role="form">
                <div className="row row-sm-padding">
                    <div className="form-group">
                        <label htmlFor="type">Type</label>
                        <input type="text" name="type" className="form-control" value={this.state.type}
                            onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="symbol">Symbol</label>
                        <input type="text" name="symbol" className="form-control" value={this.state.symbol}
                            onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" name="date" className="form-control" value={this.state.date}
                            onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="shares">Shares</label>
                        <input type="number" name="shares" className="form-control" value={this.state.shares}
                            onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input type="number" name="price" className="form-control" value={this.state.price}
                            onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="commission">Commission</label>
                        <input type="number" name="commission" className="form-control" value={this.state.commission}
                            onChange={this.handleInputChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="notes">Notes</label>
                        <input type="text" name="notes" className="form-control" value={this.state.notes}
                            onChange={this.handleInputChange}/>
                    </div>
                </div>
                <button className="btn btn-primary" onClick={this.handleSubmit}>
                    Add Transaction
                </button>
            </form>
        );
    }
}

export default TscsForm;