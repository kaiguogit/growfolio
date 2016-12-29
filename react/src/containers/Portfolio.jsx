import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import * as navigation from '../constants/navigation';

import NProgress from 'nprogress';

//Components
import { Tabs, Tab } from 'react-bootstrap';
import Tscs from './Tscs.jsx';
import Performance from './Performance.jsx';

class Portfolio extends React.Component {
    static propTypes = {
        selectedTab: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired,
        isFetching: PropTypes.bool.isRequired
    };

    render() {
        this.props.isFetching ? NProgress.start() : NProgress.done();
        return (
            <Tabs activeKey={this.props.selectedTab} onSelect={this.props.actions.selectTab} id="portfolio-tabs">
                <Tab eventKey={navigation.TAB_PERFORMANCE} title="Performance"><Performance/></Tab>
                <Tab eventKey={navigation.TAB_TSCS} title="Transactions"><Tscs/></Tab>
            </Tabs>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedTab: state.portfolioTab,
        isFetching: state.tscs.isFetching || state.quotes.isFetching
     };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
