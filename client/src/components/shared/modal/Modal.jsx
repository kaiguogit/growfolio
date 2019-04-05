import React from 'react';
import PropTypes from 'prop-types';

import ReactModal from 'react-modal';
import isolatedScroll from 'isolated-scroll';
import $ from 'jquery';

ReactModal.setAppElement('#app');

const Modal = (props) => {
    const onAfterOpen = () => {
        const modals = $('.modal-dialog');
        if (props.isOpen && modals.length) {
            modals.each((inx, modal) => {
                isolatedScroll(modal);
            });
        }
    };

    const handleSubmit = () =>{
        let result = props.onSubmit();
        if (result instanceof Promise || typeof result.then === 'function') {
            result.then(props.onClose, props.onClose);
        } else {
            props.onClose();
        }
    };

    return (
        <ReactModal
            isOpen={props.isOpen}
            contentLabel={props.contentLabel}
            onRequestClose={props.onClose}
            closeTimeoutMS={300}
            onAfterOpen={onAfterOpen}
            // modal modal-dialog classes are from bootstrap _modal.scss
            className={{
                base: 'modal-dialog',
                beforeClose: 'modal-dialog-leave',
                afterOpen: 'modal-dialog-show'
            }}
            overlayClassName={{
                base: 'modal fade react-modal',
            }}
        >
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{props.contentLabel}</h5>
                    <button type="button" className="close mod-bare" aria-label="Close"
                        onClick={props.onClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn mod-secondary" onClick={props.onClose}>
                        Cancel
                    </button>
                    <button type="button" className={"btn " + props.submitButtonClass} onClick={handleSubmit} disabled={props.isFetching}>
                        Yes
                    </button>
                </div>
            </div>
        </ReactModal>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    contentLabel: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    submitButtonClass: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default Modal;
