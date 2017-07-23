import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeGetHoldingPerformance } from '../../selectors';
import PERFORMANCE_COLUMNS from './columns';
import TableCell from '../shared/table/TableCell.jsx';

class PerformanceTableRow extends React.Component {
    render() {
        const {holding} = this.props;
        return (
            <tr>
                {PERFORMANCE_COLUMNS.map(column => {
                    return (
                        <TableCell
                            key={column.selector}
                            entry={holding}
                            column={column}
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
              holding: getHoldingPerformance(state, props)
          };
     };
     return mapStateToProps;
 };

PerformanceTableRow.propTypes = {
    symbol: PropTypes.string.isRequired,
    holding: PropTypes.object.isRequired
};

export default connect(makeMapStateToProps)(PerformanceTableRow);