import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getHoldings } from '../../selectors';

import TscsTable from './TscsTable.jsx';
import DeleteTscModal from './DeleteTscModal.jsx';

class TscsContainer extends React.Component {
    render() {
        let { isFetching, holdings, showZeroShareHolding } = this.props;
        const isEmpty = holdings.length === 0;

        // Hide holding with 0 share.
        if (!showZeroShareHolding) {
            holdings = holdings.filter(holding => holding.shares);
        }

        return (
            <div>
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

TscsContainer.propTypes = {
    holdings: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    showZeroShareHolding: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
    return {
        holdings: getHoldings(state),
        isFetching: state.tscs.isFetching,
        showZeroShareHolding: state.portfolio.showZeroShareHolding
    };
};

export default connect(mapStateToProps)(TscsContainer);
