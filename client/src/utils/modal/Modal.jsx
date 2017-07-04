import React from 'react';
import PropTypes from 'prop-types';

import ReactModal from 'react-modal';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

ReactModal.setAppElement('#app');

const Modal = (props) => {
    const handleSubmit = () => {
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
            // modal modal-dialog classes are from bootstrap _modal.scss
            className={{
                base: 'modal-dialog',
                beforeClose: 'modal-show-leave-active'
            }}
            overlayClassName={{
                base: 'modal fade',
                afterOpen: 'show'
            }}
        >
            <ReactCSSTransitionGroup
                transitionName="modal-show"
                transitionAppear={true}
                transitionAppearTimeout={300}
                transitionEnter={false}
                transitionLeave={false}
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
                        <button type="button" className="btn mod-danger" onClick={handleSubmit} disabled={props.isFetching}>
                            Yes
                        </button>
                    </div>
                </div>
            </ReactCSSTransitionGroup>
        </ReactModal>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    contentLabel: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
};

export default Modal;
