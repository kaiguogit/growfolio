import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as quotesActions from '../../actions/quotes';
import { bindActionCreators } from 'redux';

class RefreshButton extends React.Component {
    render() {
        const { isFetching, actions, download, fetchingSymbol } = this.props;
        return(
            <button type="button" className="mod-small"
                onClick={() => actions.refreshQuotes(download)}
                disabled={isFetching}>
                <i className={`fa fa-refresh${isFetching ? ' fa-spin' : ''}`} aria-hidden="true"/>
                <span className="ml-2">
                    {download && 'Download Latest Quote'}
                    {!download && 'Refresh'}
                    {download && fetchingSymbol && `: ${fetchingSymbol}`}
                </span>
            </button>
        );
    }
}

RefreshButton.propTypes = {
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
    download: PropTypes.bool.isRequired,
    fetchingSymbol: PropTypes.string
};

const mapStateToProps = state => {
    return {
        isFetching: state.tscs.isFetching || state.quotes.isFetching,
        fetchingSymbol: state.quotes.fetchingSymbol
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(quotesActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RefreshButton);
