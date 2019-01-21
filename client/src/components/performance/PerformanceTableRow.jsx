import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeGetHoldingPerformance, getDisplayCurrency } from '../../selectors';
import TableCell from '../shared/table/TableCell.jsx';

class PerformanceTableRow extends React.Component {
    render() {
        const {holding, displayCurrency, columns} = this.props;
        return (
            <tr>
                {columns.map(column => {
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
    displayCurrency: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired
};

export default connect(makeMapStateToProps)(PerformanceTableRow);