import React from 'react';
import PropTypes from 'prop-types';

import * as actions from '../../actions/tscs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const iconClass = {
    delete: 'fa fa-trash-o',
    edit: 'fa fa-pencil'
};

const buttonClass = {
    delete: 'mod-danger',
    edit: ''
};

class TscActionButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleOpenModal = this.handleOpenModal.bind(this);
    }

    handleOpenModal() {
        if (this.props.type === 'delete') {
            this.props.actions.toggleTscsDeleteModal(true, this.props.tsc);
        }
        if (this.props.type === 'edit') {
            this.props.actions.toggleTscsModal(true, this.props.tsc);
        }
    }

    render() {
        const {type} = this.props;
        return (
            <button className={buttonClass[type] + " mod-no-margin mod-icon"}
                onClick={this.handleOpenModal.bind(this)}>
                <i className={iconClass[type]} aria-hidden="true"/>
            </button>
        );
    }
}

TscActionButton.propTypes = {
    actions: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    tsc: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(TscActionButton);
