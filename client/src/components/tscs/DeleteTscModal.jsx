import React from 'react';
import PropTypes from 'prop-types';

import * as actions from '../../actions/tscs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from '../shared/modal/Modal.jsx';

class DeleteTscModal extends React.Component {
    constructor () {
        super();
        this.state = {secModal: false};
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }
    handleCloseModal() {
        this.props.actions.toggleTscsDeleteModal(false);
    }

    render() {
        let {isOpened, isFetching, actions, tsc} = this.props;
        // modal modal-dialog classes are from bootstrap _modal.scss
        return (
            <Modal
                isOpen={isOpened}
                contentLabel="Delete Transaction"
                onClose={this.handleCloseModal}
                onSubmit={() => actions.removeTscs(tsc)}
                submitButtonClass="mod-danger"
                isFetching={isFetching}
            >
                {"Do you want to delete this transaction?"}
            </Modal>
        );
    }
}

DeleteTscModal.propTypes = {
    isOpened: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    tsc: PropTypes.object
};

const mapStateToProps = state => {
    return {
        isOpened: state.tscs.deleteTscModalData.isOpened,
        tsc: state.tscs.deleteTscModalData.tsc,
        isFetching: state.tscs.isFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTscModal);
