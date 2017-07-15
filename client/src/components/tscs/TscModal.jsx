import React from 'react';
import PropTypes from 'prop-types';

import * as actions from '../../actions/tscs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from '../shared/modal/Modal.jsx';
import TscsForm from './TscsForm.jsx';

class TscModal extends React.Component {
    constructor () {
        super();
        this.state = {secModal: false}
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCloseModal() {
        this.props.actions.toggleTscsModal(false);
    }

    handleSubmit() {
        if (this.props.tsc) {
            return this.props.actions.editTsc(this.tscsForm.getState());
        }
        return this.props.actions.createTsc(this.tscsForm.getState());
    }

    render() {
        let {isOpened, isFetching, tsc} = this.props;
        // modal modal-dialog classes are from bootstrap _modal.scss
        return (
            <Modal
                isOpen={isOpened}
                contentLabel="Add Transaction"
                onClose={this.handleCloseModal}
                onSubmit={this.handleSubmit}
                submitButtonClass="mod-primary"
                isFetching={isFetching}
            >
            {/* Use callback instead of string in ref according to React documentation.
                https://facebook.github.io/react/docs/refs-and-the-dom.html#legacy-api-string-refs
                https://github.com/facebook/react/pull/8333#issuecomment-271648615
            */}
                <TscsForm ref={tscsForm => this.tscsForm = tscsForm} tsc={tsc}/>
            </Modal>
        );
    }
}

TscModal.propTypes = {
    isOpened: PropTypes.bool.isRequired,
    tsc: PropTypes.object,
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
    return {
        isOpened: state.tscs.dialogModal.isOpened,
        tsc: state.tscs.dialogModal.tsc,
        isFetching: state.tscs.isFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TscModal);
