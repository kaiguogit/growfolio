import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as rootActions from '../../actions';
import * as tscsActions from '../../actions/tscs';
import * as quotesActions from '../../actions/quotes';

import NProgress from 'nprogress';
import isEqual from 'lodash.isequal';

import NavLink from '../NavLink.jsx';
import Performance from '../performance/Performance.jsx';
import TscsContainer from '../tscs/TscsContainer.jsx';
import Balance from '../balance/Balance.jsx';
import PerformanceSetting from '../performance/PerformanceSetting.jsx';
import ActionBar from './ActionBar.jsx';
import NotFoundPage from '../NotFoundPage.jsx';
import TscModal from '../tscs/TscModal.jsx';

class Portfolio extends React.Component {
    componentDidMount() {
        const tscs = this.props.tscs;
        if (tscs.length === 0) {
            this.props.actions.fetchTscs();
        }
        this.props.actions.setIntervalRefreshQuotes();
    }

    componentDidUpdate(prevProps) {
        //Only refresh quotes when holdings or display currency changed
        if (!(isEqual(prevProps.tscs, this.props.tscs) &&
            prevProps.portfolio.displayCurrency === this.props.portfolio.displayCurrency)) {
            this.props.actions.refreshQuotes();
        }
    }

    componentWillUnmount() {
        NProgress.done();
    }

    render() {
        let {isTscsFetching, isFetching} = this.props;
        isFetching ? NProgress.start() : NProgress.done();
        const tabItem = 'tabbed-pane-nav-item';
        const tabButton = 'tabbed-pane-nav-item-button';
        const url = '/portfolio/';
        return (
            <div>
                <div className="tabbed-pane-nav mod-left u-clearfix">
                    <div className="layout-center-xl">
                        <ul>
                            <li className={tabItem}>
                                <NavLink className={tabButton} to={`${url}performance`} role="tab">
                                    <span>Performance</span>
                                </NavLink>
                            </li>
                            <li className={tabItem}>
                                <NavLink className={tabButton} to={`${url}transactions`} role="tab">
                                    <span>Transactions</span>
                                </NavLink>
                            </li>
                            <li className={tabItem}>
                                <NavLink className={tabButton} to={`${url}balance`} role="tab">
                                    <span>Balance</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={`tabbed-pane-main-col-loading ${isTscsFetching ? '' : 'u-hidden'}`}>
                    <span className="tabbed-pane-main-col-loading-spinner">
                        <i className="fa fa-spinner fa-2x fa-spin" aria-hidden="true"/>
                    </span>
                </div>
                <div className={`${isTscsFetching ? 'u-hidden' : ''} layout-center-xl`}>
                    <Route path={url} render={({location}) => {
                        if (location.pathname !== url + 'setting') {
                            return <ActionBar/>;
                        }
                        return null;
                    }}/>
                    <Switch>
                        <Route exact path={url} render={() => <Redirect to="/portfolio/performance" component={Performance}/>}/>
                        <Route exact path={url + "performance"} component={Performance}/>
                        <Route exact path={url + "transactions"} component={TscsContainer}/>
                        <Route exact path={url + "setting"} component={PerformanceSetting}/>
                        <Route exact path={url + "balance"} component={Balance}/>
                        <Route component={NotFoundPage}/>
                    </Switch>
                </div>
                <TscModal/>
            </div>
        );
    }
}

Portfolio.propTypes = {
    portfolio: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    tscs: PropTypes.array,
    isFetching: PropTypes.bool.isRequired,
    isTscsFetching: PropTypes.bool.isRequired,
    children: PropTypes.element
};

const mapStateToProps = state => {
    return {
        portfolio: state.portfolio,
        isTscsFetching: state.tscs.isFetching,
        isFetching: state.tscs.isFetching || state.quotes.isFetching,
        tscs: state.tscs.items
     };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(Object.assign(rootActions, tscsActions, quotesActions), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
