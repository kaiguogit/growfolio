import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as rootActions from '../actions';
import * as tscsActions from '../actions/tscs';
import Performance from './performance/Performance.jsx';
import TscsContainer from './tscs/TscsContainer.jsx';
import Balance from './balance/Balance.jsx';
import {PERFORMANCE, TSCS, BALANCE} from '../constants/navigation';
import * as Utils from '../utils';

import NProgress from 'nprogress';

class Portfolio extends React.Component {
    static propTypes = {
        selectedTab: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
        tscs: PropTypes.object,
        isFetching: PropTypes.bool.isRequired
    };

    componentDidMount() {
        const tscs = this.props.tscs;
        if (Object.keys(tscs).length === 0) {
            this.props.actions.fetchTscs();
        }
    }

    componentWillUnmount() {
        NProgress.done();
    }

    render() {
        this.props.isFetching ? NProgress.start() : NProgress.done();
        const cap = Utils.capitalize;
        return (
            <div>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href={`#${PERFORMANCE}`} role="tab">
                            {cap(PERFORMANCE)}
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href={`#${TSCS}`} role="tab">
                            {cap(TSCS)}
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href={`#${BALANCE}`} role="tab">
                            {cap(BALANCE)}
                        </a>
                    </li>
                </ul>
                <div className="tab-content">
                  <div className="tab-pane active" id={PERFORMANCE} role="tabpanel"><Performance/></div>
                  <div className="tab-pane" id={TSCS} role="tabpanel"><TscsContainer/></div>
                  <div className="tab-pane" id={BALANCE} role="tabpanel"><Balance/></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedTab: state.portfolio.tab,
        isFetching: state.tscs.isFetching || state.quotes.isFetching,
        tscs: state.tscs.items
     };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Object.assign(rootActions, tscsActions), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
