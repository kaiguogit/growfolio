import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/quotes';

// Memoized selector
import { getHoldings } from '../selectors';

import PerformanceTable from '../components/PerformanceTable.jsx';

class Performance extends React.Component {
    static propTypes = {
        holdings: PropTypes.array.isRequired,
        actions: PropTypes.object.isRequired
    }

    componentDidMount() {
        setInterval(this.refreshQuotes, 10000);
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
                <p>
                    <a href="#"
                     onClick={this.refreshQuotes}>
                    Refresh Quotes
                    </a>
                </p>
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