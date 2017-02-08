import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as rootActions from '../actions';
import * as tscsActions from '../actions/tscs';

import * as navigation from '../constants/navigation';
import NavLink from './NavLink.jsx';
import * as Utils from '../utils';

import NProgress from 'nprogress';

class Portfolio extends React.Component {
    static propTypes = {
        selectedTab: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
        tscs: PropTypes.array,
        isFetching: PropTypes.bool.isRequired,
        children: PropTypes.element
    };

    componentDidMount() {
        const tscs = this.props.tscs;
        if (Array.isArray(tscs) && tscs.length === 0) {
            this.props.actions.fetchTscs();
        }
    }

    componentWillUnmount() {
        NProgress.done();
    }

    render() {
        this.props.isFetching ? NProgress.start() : NProgress.done();
        return (
            <div>
                <ul className="nav nav-tabs">
                    <NavLink to={'/portfolio/' + navigation.PERFORMANCE}><span>{Utils.capitalize(navigation.PERFORMANCE)}</span></NavLink>
                    <NavLink to={'/portfolio/' + navigation.TSCS}><span>{Utils.capitalize(navigation.TSCS)}</span></NavLink>
                    <NavLink to={'/portfolio/' + navigation.BALANCE}><span>{Utils.capitalize(navigation.BALANCE)}</span></NavLink>
                </ul>
                {this.props.children}
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
