import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTotalPerformance } from '../../selectors';
import PERFORMANCE_COLUMNS from './columns';
import TableCell from '../shared/table/TableCell.jsx';

const validColumn = ['cost', 'mkt_value', 'changePercent', 'daysGain', 'gain',
'gainPercent', 'gainOverall', 'gainOverallPercent', 'realizedGain', 'dividend', 'costOverall'];

class PerformanceTableRowTotal extends React.Component {
    constructor(props) {
        super(props);
        this.renderValidCell = this.renderValidCell.bind(this);
    }

    /**
      * We generate a unique key, e.g 'change-0.55' to make sure React create
      * a new component on update to trigger 'Appear' animation
      */
    renderValidCell(column) {
        let {selector, className} = column;
        let total = this.props.total;
        if (validColumn.indexOf(selector) !== -1) {
            return (
                <TableCell
                    key={selector}
                    entry={total}
                    column={column}
                />
            );
        }
        return (
            <td className={className} key={selector}>
                {selector ==='symbol' ? 'Total' : ''}
            </td>
        );
    }

    render() {
        return (
            <tr>
                {PERFORMANCE_COLUMNS.map(column => {
                    return this.renderValidCell(column);
                })}
            </tr>
        );
    }
}

PerformanceTableRowTotal.propTypes = {
    total: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
      total: getTotalPerformance(state)
  };
};
export default connect(mapStateToProps)(PerformanceTableRowTotal);