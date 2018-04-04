import React from 'react';
import PropTypes from 'prop-types';

import * as actions from '../../actions/quotes';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from '../shared/modal/Modal.jsx';
import QuoteForm from './QuoteForm.jsx';

class QuoteModal extends React.Component {
    constructor () {
        super();
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCloseModal() {
        this.props.actions.toggleQuoteModal(false);
    }

    handleSubmit() {
        // if (this.props.quote) {
        //     return this.props.actions.editQuote(this.quoteForm.getState());
        // }
        return this.props.actions.createQuote(this.quoteForm.getState());
    }

    render() {
        let {isOpened, isFetching, quote} = this.props;
        // modal modal-dialog classes are from bootstrap _modal.scss
        return (
            <Modal
                isOpen={isOpened}
                contentLabel="Add Quote"
                onClose={this.handleCloseModal}
                onSubmit={this.handleSubmit}
                submitButtonClass="mod-primary"
                isFetching={isFetching}
            >
            {/* Use callback instead of string in ref according to React documentation.
                https://facebook.github.io/react/docs/refs-and-the-dom.html#legacy-api-string-refs
                https://github.com/facebook/react/pull/8333#issuecomment-271648615
            */}
                <QuoteForm ref={quoteForm => this.quoteForm = quoteForm} quote={quote}/>
            </Modal>
        );
    }
}

QuoteModal.propTypes = {
    isOpened: PropTypes.bool.isRequired,
    quote: PropTypes.object,
    actions: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
    return {
        isOpened: state.quotes.dialogModal.isOpened,
        quote: state.quotes.dialogModal.quote,
        isFetching: state.quotes.isFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuoteModal);
