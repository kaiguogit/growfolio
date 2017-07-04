import React from 'react';
import PropTypes from 'prop-types';

import * as actions from '../../actions/tscs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class DeleteTscButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleOpenModal = this.handleOpenModal.bind(this);
    }

    handleOpenModal() {
        this.props.actions.toggleTscsDeleteModal(true, this.props.tscId);
    }

    render() {
        return (
            <button className="mod-danger mod-no-margin mod-icon" onClick={this.handleOpenModal.bind(this)}>
                <i className="fa fa-trash-o" aria-hidden="true"/>
            </button>
        );
    }
}

DeleteTscButton.propTypes = {
    actions: PropTypes.object.isRequired,
    tscId: PropTypes.string.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(DeleteTscButton);
