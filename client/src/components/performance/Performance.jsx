import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as quotesActions from '../../actions/quotes';
import isEqual from 'lodash.isequal';
import { getHoldings } from '../../selectors';
import RefreshQuotesButton from './RefreshQuotesButton.jsx';
import PerformanceTable from './PerformanceTable.jsx';
import PerformanceTotal from './PerformanceTotal.jsx';
import SettingButton from './SettingButton.jsx';

class Performance extends React.Component {
    static propTypes = {
        holdings: PropTypes.array.isRequired,
        actions: PropTypes.object.isRequired,
        displayCurrency: PropTypes.string.isRequired
    }

    componentDidMount() {
        this.props.actions.setIntervalRefreshQuotes();
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
        this.props.actions.refreshQuotes();
    }

    render() {
        const { holdings } = this.props;
        return(
            <div>
                <div>
                    <RefreshQuotesButton refreshFn={this.refreshQuotes}/>
                    <SettingButton/>
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
        actions: bindActionCreators(quotesActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Performance);