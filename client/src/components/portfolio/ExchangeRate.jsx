import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as currencyActions from '../../actions/currency';
import { bindActionCreators } from 'redux';

class ExchangeRate extends React.Component {
    render() {
        const { isFetching, actions } = this.props;
        return(
            <button type="button" className="mod-small"
                onClick={() => actions.downloadCurrency()}
                disabled={isFetching}>
                <i className={`fa fa-refresh${isFetching ? ' fa-spin' : ''}`} aria-hidden="true"/>
                <span className="ml-2">
                    Download Exchange Rate
                </span>
            </button>
        );
    }
}

ExchangeRate.propTypes = {
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
    return {
        isFetching: state.currency.isFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(currencyActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeRate);
