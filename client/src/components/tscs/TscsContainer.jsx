import React from 'react';
import PropTypes from 'prop-types';

import * as actions from '../../actions/tscs';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getHoldings } from '../../selectors';

import TscsTable from './TscsTable.jsx';
import DeleteTscModal from './DeleteTscModal.jsx';
import AddTscModal from './AddTscModal.jsx';

class TscsContainer extends React.Component {
    render() {
        const { isFetching, holdings, actions } = this.props;
        const isEmpty = holdings.length === 0;
        return (
            <div>
                <button onClick={actions.toggleTscsAddModal.bind(null, true)}>
                    Add Transaction
                </button>
                {isEmpty
                  ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                  : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                      <TscsTable holdings={holdings}/>
                    </div>
                }
                <AddTscModal/>
                <DeleteTscModal/>
            </div>
        );
    }
}

TscsContainer.propTypes = {
    holdings: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        holdings: getHoldings(state),
        isFetching: state.tscs.isFetching,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TscsContainer);
