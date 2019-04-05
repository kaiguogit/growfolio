import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getHoldingsWithValidTscs, getDisplayCurrency } from '../../selectors';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/tscs';

import TscsTable from './TscsTable.jsx';
import DeleteTscModal from './DeleteTscModal.jsx';

class TscsContainer extends React.Component {
    render() {
        let { isFetching, holdings, displayCurrency, actions, startDate,
            endDate} = this.props;
        const isEmpty = holdings.length === 0;

        return (
            <div>
                {isEmpty
                  ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
                  : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
                      <TscsTable holdings={holdings} displayCurrency={displayCurrency}
                        setCollapse={actions.setOneCollapse}
                        startDate={startDate}
                        endDate={endDate}/>
                    </div>
                }
                <DeleteTscModal/>
            </div>
        );
    }
}

TscsContainer.propTypes = {
    holdings: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    displayCurrency: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired
};

const mapStateToProps = state => {
    return {
        holdings: getHoldingsWithValidTscs(state),
        isFetching: state.tscs.isFetching,
        displayCurrency: getDisplayCurrency(state),
        startDate: state.portfolio.startDate,
        endDate: state.portfolio.endDate
    };
};

const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TscsContainer);
