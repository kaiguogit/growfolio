import React, { PropTypes } from 'react';

const DeleteTsc = ({
    onConfirm,
    id,
    loading
}) => {
    const modelId = `tsc-delete-confirmation-${id}`;
    const handleClick = () => {
        onConfirm();
        $('#' + modelId).modal('hide');
    };
    return (
        <div>
            <button className="btn btn-danger btn-sm" data-target={'#' + modelId} data-toggle="modal">
                Delete
            </button>
            <div className="modal fade" id={modelId} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Confirmation</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Do you want to delete this transaction?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger"
                                onClick={handleClick} disabled={loading}>
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

DeleteTsc.propTypes = {
    onConfirm: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired
};

export default DeleteTsc;
