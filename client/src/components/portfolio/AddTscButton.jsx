import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as tscsActions from '../../actions/tscs';
import { bindActionCreators } from 'redux';


class AddTscButton extends React.Component {
    render() {
        return (
            <button className="mod-small" onClick={this.props.actions.toggleTscsAddModal.bind(null, true)}>
                <i className="fa fa-plus fa-lg" aria-hidden="true"/>
                <span className="ml-2">
                    Add Transaction
                </span>
            </button>
        );
    }
}

AddTscButton.propTypes = {
    actions: PropTypes.object.isRequired
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(tscsActions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTscButton);
