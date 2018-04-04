import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as quotesActions from '../../actions/quotes';
import { getHoldings } from '../../selectors';
import DatePicker from 'react-datepicker';
import { FormGroup } from '../shared/index.jsx';
import QuoteModal from './QuoteModal.jsx';

class Quote extends React.Component {
    constructor(props) {
        super(props);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    handleDateChange(date) {
        this.props.actions.setQuoteDisplayDate(date);
    }

    openModal(holding) {
        let quote = this.getQuote(holding.symbol) || {
            symbol: holding.symbol,
            currency: holding.currency,
        };
        this.props.actions.toggleQuoteModal(true, quote);
    }

    getQuote(symbol) {
        return this.props.quotes[symbol];
    }

    getQuotePrice(symbol) {
        let quote = this.getQuote(symbol);
        return quote ? quote.price : '';
    }

    render() {
        let { showZeroShareHolding, holdings} = this.props;
        // Hide holding with 0 share.
        if (!showZeroShareHolding) {
            holdings = holdings.filter(holding => holding.shares);
        }

        return (
            <div>
                <FormGroup>
                    <label htmlFor="date">Date</label>
                    <DatePicker
                        selected={this.props.displayDate}
                        onChange={this.handleDateChange}
                        className="form-control"
                    />
                </FormGroup>
                <table>
                    <tbody>
                        {
                            holdings.map((h) => {
                                return (
                                    <tr key={h.symbol}>
                                        <td>{h.symbol}</td>
                                        <td>{this.getQuotePrice(h.symbol) || "Quote not found"}</td>
                                        <td>
                                            <button className="mod-no-margin mod-icon"
                                                title="Edit"
                                                onClick={this.openModal.bind(this, h)}>
                                                <i className="fa fa-pencil" aria-hidden="true"/>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <QuoteModal/>
            </div>
        );
    }
}

Quote.propTypes = {
    holdings: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    displayDate: PropTypes.object.isRequired,
    quotes: PropTypes.object.isRequired,
    showZeroShareHolding: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
    return {
        holdings: getHoldings(state),
        displayDate: state.quotes.displayDate,
        quotes: state.quotes.items,
        showZeroShareHolding: state.portfolio.showZeroShareHolding
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(quotesActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Quote);