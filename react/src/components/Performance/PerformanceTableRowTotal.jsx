import React, { PropTypes } from 'react';
import { PERFORMANCE_COLUMNS } from './columns.jsx';
import NumberChangeTransition from '../Animation/NumberChangeTransition.jsx';

const validColumn = ['cost', 'mkt_value', 'change_percent', 'days_gain', 'gain',
'gain_percent', 'gain_overall', 'gain_overall_percent', 'realized_gain', 'dividend', 'cost_overall'];

class PerformanceTableRowTotal extends React.Component {
    static propTypes = {
        total: PropTypes.object.isRequired
    }

    renderCellContent(column) {
        let value = this.props.total[column.selector];
        if (column.formatFunction) {
            return column.formatFunction(this.props.total, column);
        }
        return column.filter ? column.filter(value) : value;
    }

    /**
      * We generate a unique key, e.g 'change-0.55' to make sure React create
      * a new component on update to trigger 'Appear' animation
      */
    renderCell(column) {
        if (validColumn.indexOf(column.selector) !== -1) {
            return (
                <td key={`${column.selector}-${this.props.total[column.selector]}`}>
                    <NumberChangeTransition upOrDown={this.props.total[column.selector] > 0}>
                        <div>
                            {this.renderCellContent(column)}
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
                    return this.renderCell(column);
                })}
            </tr>
        );
    }
}

export default PerformanceTableRowTotal;