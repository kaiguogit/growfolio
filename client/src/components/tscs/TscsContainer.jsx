import React, { PropTypes } from 'react';
import * as actions from '../../actions/tscs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getHoldings } from '../../selectors';

import TscsTable from './TscsTable.jsx';
import TscsForm from './TscsForm.jsx';
import DeleteTscModal from './DeleteTscModal.jsx';

class TscsContainer extends React.Component {
    static propTypes = {
      holdings: PropTypes.array.isRequired,
      isFetching: PropTypes.bool.isRequired,
      formOpened: PropTypes.bool.isRequired,
      actions: PropTypes.object.isRequired
    }

    handleFormSubmit = tsc => {
        this.props.actions.createTscs(tsc);
        this.props.actions.closeTscsForm();
    }

    render() {
        const { isFetching, holdings, formOpened, actions } = this.props;
        const isEmpty = holdings.length === 0;
        return (
            <div>
                <button className={`btn btn-sm ${formOpened ? "btn-info" : "btn-info "}`} onClick={formOpened ? actions.closeTscsForm : actions.openTscsForm}>
                    <i className={formOpened ? "fa fa-minus-square-o" : "fa fa-plus-square-o"} aria-hidden="true"/>
                    {" "}
                    Add Transaction
                </button>
                {/* Formm stay opened during fetching */}
                {(isFetching || formOpened) &&
                    <TscsForm onSubmit={this.handleFormSubmit} isFetching={isFetching}/>
                }
                {isEmpty
                  ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                  : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                      <TscsTable holdings={holdings}/>
                    </div>
                }
                <DeleteTscModal/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        holdings: getHoldings(state),
        isFetching: state.tscs.isFetching,
        formOpened: state.tscs.formOpened
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TscsContainer);
