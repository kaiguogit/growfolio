import React from 'react';
import PropTypes from 'prop-types';

import * as actions from '../../actions/tscs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from '../shared/modal/Modal.jsx';
import TscsForm from './TscsForm.jsx';

class AddTscModal extends React.Component {
    constructor () {
        super();
        this.state = {secModal: false}
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCloseModal() {
        this.props.actions.toggleTscsAddModal(false);
    }

    handleSubmit() {
        return this.props.actions.createTscs(this.refs.tscsForm.getState());
    }

    render() {
        let {isOpened, isFetching} = this.props;
        // modal modal-dialog classes are from bootstrap _modal.scss
        return (
            <Modal
                isOpen={isOpened}
                contentLabel="Add Transaction"
                onClose={this.handleCloseModal}
                onSubmit={this.handleSubmit.bind(this)}
                isFetching={isFetching}
            >
                <TscsForm ref="tscsForm"/>
            </Modal>
        );
    }
}

AddTscModal.propTypes = {
    isOpened: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
    return {
        isOpened: state.tscs.addTscModalOpened,
        isFetching: state.tscs.isFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTscModal);
