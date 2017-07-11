import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as rootActions from '../../actions';
import * as tscsActions from '../../actions/tscs';
import * as quotesActions from '../../actions/quotes';

import NavLink from '../NavLink.jsx';

import {PERFORMANCE, TSCS, BALANCE} from '../../constants/navigation';
import * as Utils from '../../utils';

import NProgress from 'nprogress';

import Performance from '../performance/Performance.jsx';
import TscsContainer from '../tscs/TscsContainer.jsx';
import Balance from '../balance/Balance.jsx';
import PerformanceSetting from '../performance/PerformanceSetting.jsx';
import ActionBar from './ActionBar.jsx';
import NotFoundPage from '../NotFoundPage.jsx';
import AddTscModal from '../tscs/AddTscModal.jsx';

class Portfolio extends React.Component {
    componentDidMount() {
        const tscs = this.props.tscs;
        if (Object.keys(tscs).length === 0) {
            this.props.actions.fetchTscs().then(
                this.props.actions.refreshQuotes);
        }
        this.props.actions.setIntervalRefreshQuotes();
    }

    componentWillUnmount() {
        NProgress.done();
    }

    render() {
        let {isTscsFetching, isFetching} = this.props;
        isFetching ? NProgress.start() : NProgress.done();
        const cap = Utils.capitalize;
        const tabItem = 'tabbed-pane-nav-item';
        const tabButton = 'tabbed-pane-nav-item-button';
        const url = '/portfolio/';
        return (
            <div className="layout-center-xl">
                <div className="tabbed-pane-nav mod-left u-clearfix">
                    <ul>
                        <li className={tabItem}>
                            <NavLink className={tabButton} to={`${url}performance`} role="tab">
                                <span>{cap(PERFORMANCE)}</span>
                            </NavLink>
                        </li>
                        <li className={tabItem}>
                            <NavLink className={tabButton} to={`${url}transactions`} role="tab">
                                <span>{cap(TSCS)}</span>
                            </NavLink>
                        </li>
                        <li className={tabItem}>
                            <NavLink className={tabButton} to={`${url}balance`} role="tab">
                                <span>{cap(BALANCE)}</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className={`tabbed-pane-main-col-loading ${isTscsFetching ? '' : 'u-hidden'}`}>
                    <span className="tabbed-pane-main-col-loading-spinner">
                        <i className="fa fa-spinner fa-2x fa-spin" aria-hidden="true"/>
                    </span>
                </div>
                <div className={isTscsFetching ? 'u-hidden' : ''}>
                    <ActionBar/>
                    <Switch>
                        <Route exact path="/portfolio/" render={() => <Redirect to="/portfolio/performance" component={Performance}/>}/>
                        <Route exact path={url + "performance"} component={Performance}/>
                        <Route exact path={url + "transactions"} component={TscsContainer}/>
                        <Route exact path={url + "setting"} component={PerformanceSetting}/>
                        <Route exact path={url + "balance"} component={Balance}/>
                        <Route component={NotFoundPage}/>
                    </Switch>
                </div>
                <AddTscModal/>
            </div>
        );
    }
}

Portfolio.propTypes = {
    selectedTab: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    tscs: PropTypes.object,
    isFetching: PropTypes.bool.isRequired,
    isTscsFetching: PropTypes.bool.isRequired,
    children: PropTypes.element
};

const mapStateToProps = state => {
    return {
        selectedTab: state.portfolio.tab,
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
