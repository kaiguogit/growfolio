import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as quotesActions from '../../actions/quotes';
import { bindActionCreators } from 'redux';

class RefreshButton extends React.Component {
    render() {
        const { isFetching, actions } = this.props;
        return(
            <button type="button" className={`btn d-inline-block mr-2 ${isFetching ? "btn-outline-danger" : "btn-outline-primary"}`}
                onClick={actions.refreshFn}
                disabled={isFetching}>
                <i className={`fa fa-refresh${isFetching ? ' fa-spin' : ''}`} aria-hidden="true"/>
                <span className="ml-2">
                    Refresh
                </span>
            </button>
        );
    }
}

RefreshButton.propTypes = {
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
    return {
        isFetching: state.tscs.isFetching || state.quotes.isFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(quotesActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RefreshButton);
