import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as quotesActions from '../../actions/quotes';
import * as currencyActions from '../../actions/currency';
import * as rootActions from '../../actions';
import isEqual from 'lodash.isequal';
import { getHoldings } from '../../selectors';
import RefreshQuotesButton from './../RefreshQuotesButton.jsx';
import PerformanceTable from '../../components/Performance/PerformanceTable.jsx';
import PerformanceTotal from './PerformanceTotal.jsx';
import CurrencySelector from './../CurrencySelector.jsx';
const REFRESH_QUOTES_INTERVAL = 600000;

class Performance extends React.Component {
    static propTypes = {
        holdings: PropTypes.array.isRequired,
        actions: PropTypes.object.isRequired,
        displayCurrency: PropTypes.string.isRequired
    }

    componentDidMount() {
        setInterval(this.refreshQuotes, REFRESH_QUOTES_INTERVAL);
    }

    componentDidUpdate(prevProps) {
        //Only refresh quotes when holdings or display currency changed
        if (!(isEqual(prevProps.holdings, this.props.holdings) &&
            prevProps.displayCurrency === this.props.displayCurrency)) {
            this.refreshQuotes();
        }
    }

    refreshQuotes = e => {
        if (e) {
            e.preventDefault();
        }
        this.props.actions.fetchQuotes(this.props.holdings.map(x => ({
            symbol: x.symbol,
            exch: x.exch
        })));
        let currencyPairs = [];

        this.props.holdings.forEach(x => {
            let pair = x.currency + this.props.displayCurrency;
            if (x.currency !== this.props.displayCurrency && currencyPairs.indexOf(pair) === -1) {
                currencyPairs.push(pair);
            }
        });
        this.props.actions.fetchCurrency(currencyPairs);
    }

    render() {
        const { holdings } = this.props;
        return(
            <div>
                <div>
                    <CurrencySelector/>
                    <RefreshQuotesButton refreshFn={this.refreshQuotes}/>
                </div>
                <PerformanceTotal/>
                <PerformanceTable symbols={holdings.map(x => x.symbol)}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        holdings: getHoldings(state),
        displayCurrency: state.portfolio.displayCurrency
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            Object.assign(rootActions, quotesActions, currencyActions), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Performance);