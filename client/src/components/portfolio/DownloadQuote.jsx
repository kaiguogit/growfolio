import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as quotesActions from '../../actions/quotes';
import { bindActionCreators } from 'redux';

class DownloadQuotesButton extends React.Component {
    render() {
        const { isFetching, actions } = this.props;
        return(
            <button type="button" className="mod-small"
                onClick={actions.downloadQuotes}
                disabled={isFetching}>
                <i className={`fa fa-refresh${isFetching ? ' fa-spin' : ''}`} aria-hidden="true"/>
                <span className="ml-2">
                    Download Quotes
                </span>
            </button>
        );
    }
}

DownloadQuotesButton.propTypes = {
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
    return {
        isFetching: state.quotes.isFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(quotesActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadQuotesButton);
