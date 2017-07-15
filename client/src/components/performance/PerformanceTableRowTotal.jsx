import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getTotalPerformance } from '../../selectors';

import { PERFORMANCE_COLUMNS } from './columns';
import NumberChangeTransition from '../Animation/NumberChangeTransition.jsx';
import { renderCell } from '../../utils';

const validColumn = ['cost', 'mkt_value', 'change_percent', 'days_gain', 'gain',
'gain_percent', 'gain_overall', 'gain_overall_percent', 'realized_gain', 'dividend', 'cost_overall'];

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
        if (validColumn.indexOf(column.selector) !== -1) {
            return (
                <td className={column.className} key={`${column.selector}-${this.props.total[column.selector]}`}>
                    <NumberChangeTransition upOrDown={this.props.total[column.selector] > 0}>
                        <div>
                            {renderCell(this.props.total, column)}
                        </div>
                    </NumberChangeTransition>
                </td>
            );
        }
        return (
            <td className={column.className} key={column.selector}>
                {column.selector ==='symbol' ? 'Total' : ''}
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