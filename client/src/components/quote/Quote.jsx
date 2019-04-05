import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as quotesActions from '../../actions/quotes';
import { getHoldingsAfterZeroShareFilter } from '../../selectors';
import { getQuotes } from '../../selectors/quoteSelector';
import DatePicker from 'react-datepicker';
import { FormGroup } from '../shared/index.jsx';
import QuoteModal from './QuoteModal.jsx';
import moment from 'moment-timezone';

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
        const quoteMap = this.getQuote(symbol);
        const date = moment(this.props.displayDate).format('YYYY-MM-DD');
        return quoteMap && quoteMap[date] && quoteMap[date].close || '';
    }

    render() {
        let {holdings} = this.props;

        return (
            <div>
                <FormGroup>
                    <label htmlFor="date">Date</label>
                    <DatePicker
                        selected={this.props.displayDate.toDate()}
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
};

const mapStateToProps = state => {
    return {
        holdings: getHoldingsAfterZeroShareFilter(state),
        displayDate: state.quotes.displayDate,
        quotes: getQuotes(state),
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(quotesActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Quote);