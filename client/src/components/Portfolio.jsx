import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as rootActions from '../actions';
import * as tscsActions from '../actions/tscs';
import NavLink from './NavLink.jsx';

import {PERFORMANCE, TSCS, BALANCE} from '../constants/navigation';
import * as Utils from '../utils';

import NProgress from 'nprogress';

class Portfolio extends React.Component {
    static propTypes = {
        selectedTab: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
        tscs: PropTypes.object,
        isFetching: PropTypes.bool.isRequired,
        isTscsFetching: PropTypes.bool.isRequired,
        children: PropTypes.element
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
        let {isTscsFetching, isFetching} = this.props;
        isFetching ? NProgress.start() : NProgress.done();
        const cap = Utils.capitalize;
        const tabItem = 'tabbed-pane-nav-item';
        const tabButton = 'tabbed-pane-nav-item-button';
        const url = '/portfolio/';
        return (
            <div>
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
                <div>
                    <div className={`tabbed-pane-main-col-loading ${isTscsFetching ? '' : 'u-hidden'}`}>
                        <span className="tabbed-pane-main-col-loading-spinner">
                            <i className="fa fa-spinner fa-2x fa-spin" aria-hidden="true"/>
                        </span>
                    </div>
                    <div className={isTscsFetching ? 'u-hidden' : ''}>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

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
        actions: bindActionCreators(Object.assign(rootActions, tscsActions), dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
