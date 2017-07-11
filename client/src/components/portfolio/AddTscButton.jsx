import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as tscsActions from '../../actions/tscs';
import { bindActionCreators } from 'redux';


class AddTscButton extends React.Component {
    render() {
        return (
            <button onClick={this.props.actions.toggleTscsAddModal.bind(null, true)}>
                Add Transaction
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
