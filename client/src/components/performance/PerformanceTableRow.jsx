import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeGetHoldingPerformance, getDisplayCurrency } from '../../selectors';
import PERFORMANCE_COLUMNS from './columns';
import TableCell from '../shared/table/TableCell.jsx';

class PerformanceTableRow extends React.Component {
    render() {
        const {holding, displayCurrency} = this.props;
        return (
            <tr>
                {PERFORMANCE_COLUMNS.map(column => {
                    return (
                        <TableCell
                            key={column.selector}
                            entry={holding}
                            column={column}
                            displayCurrency={displayCurrency}
                        />
                    );
                })}
            </tr>
        );
    }
}

 const makeMapStateToProps = () => {
     const getHoldingPerformance = makeGetHoldingPerformance();
     const mapStateToProps = (state, props) => {
        return {
            holding: getHoldingPerformance(state, props),
            displayCurrency: getDisplayCurrency(state)
        };
     };
     return mapStateToProps;
 };

PerformanceTableRow.propTypes = {
    symbol: PropTypes.string.isRequired,
    holding: PropTypes.object.isRequired,
    displayCurrency: PropTypes.string.isRequired
};

export default connect(makeMapStateToProps)(PerformanceTableRow);