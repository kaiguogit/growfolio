import React, { PropTypes } from 'react';
import * as actions from '../../actions/tscs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class DeleteTscButton extends React.Component {
    static propTypes = {
        actions: PropTypes.object.isRequired,
        tscId: PropTypes.string.isRequired
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

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(DeleteTscButton);
