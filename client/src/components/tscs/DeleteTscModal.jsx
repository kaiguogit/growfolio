import React, { PropTypes } from 'react';
import * as actions from '../../actions/tscs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from '../../utils/modal/Modal.jsx';

class DeleteTscModal extends React.Component {
    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        actions: PropTypes.object.isRequired,
        tscId: PropTypes.string
    }

    constructor () {
        super();
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.state = {secModal: false}
    }
    handleCloseModal() {
        this.props.actions.toggleTscsDeleteModal(false);
    }

    render() {
        let {isOpened, actions, tscId} = this.props;
        // modal modal-dialog classes are from bootstrap _modal.scss
        return (
            <Modal
                isOpen={isOpened}
                contentLabel="Delete Transaction"
                onClose={this.handleCloseModal}
                onSubmit={() => actions.removeTscs(tscId)}
            >
                <div>
                    {"Do you want to delete this transaction?"}
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpened: state.tscs.deleteTscModalData.isOpened,
        tscId: state.tscs.deleteTscModalData.tscId,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTscModal);
