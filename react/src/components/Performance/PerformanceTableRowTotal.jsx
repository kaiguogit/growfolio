import React, { PropTypes } from 'react';
import { PERFORMANCE_COLUMNS } from './columns.jsx';
import NumberChangeTransition from '../Animation/NumberChangeTransition.jsx';
import { renderCell } from '../../utils';

const validColumn = ['cost', 'mkt_value', 'change_percent', 'days_gain', 'gain',
'gain_percent', 'gain_overall', 'gain_overall_percent', 'realized_gain', 'dividend', 'cost_overall'];

class PerformanceTableRowTotal extends React.Component {
    static propTypes = {
        total: PropTypes.object.isRequired
    }

    /**
      * We generate a unique key, e.g 'change-0.55' to make sure React create
      * a new component on update to trigger 'Appear' animation
      */
    renderValidCell(column) {
        if (validColumn.indexOf(column.selector) !== -1) {
            return (
                <td key={`${column.selector}-${this.props.total[column.selector]}`}>
                    <NumberChangeTransition upOrDown={this.props.total[column.selector] > 0}>
                        <div>
                            {renderCell(this.props.total, column)}
                        </div>
                    </NumberChangeTransition>
                </td>
            );
        }
        return (
            <td key={column.selector}>
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

export default PerformanceTableRowTotal;