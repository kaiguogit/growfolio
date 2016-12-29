import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/quotes';

// Memoized selector
import { getHoldings } from '../selectors';
import { Row, Col } from 'react-bootstrap';
import PerformanceTable from '../components/Performance/PerformanceTable.jsx';
import PerformanceTotal from './PerformanceTotal.jsx';

const REFRESH_QUOTES_INTERVAL = 60000;

class Performance extends React.Component {
    static propTypes = {
        holdings: PropTypes.array.isRequired,
        actions: PropTypes.object.isRequired
    }

    componentDidMount() {
        setInterval(this.refreshQuotes, REFRESH_QUOTES_INTERVAL);
    }

    componentDidUpdate() {
        this.refreshQuotes();
    }

    refreshQuotes = e => {
        if (e) {
            e.preventDefault();
        }
        this.props.actions.fetchQuotes(this.props.holdings.map(x => x.symbol));
    }

    render() {
        const { holdings } = this.props;
        const isEmpty = holdings.length === 0;
        return(
            <div>
                <PerformanceTotal/>
                {isEmpty
                  ? (isEmpty ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                  : <div style={{ opacity: isEmpty ? 0.5 : 1 }}>
                      <PerformanceTable symbols={holdings.map(x => x.symbol)}/>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        holdings: getHoldings(state)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Performance);