import React, { PropTypes } from 'react';
import { PERFORMANCE_COLUMNS } from './columns.jsx';

class PerformanceTableRow extends React.Component {
    static propTypes = {
        holding: PropTypes.object.isRequired
    }

    renderCell(key) {
        let column = PERFORMANCE_COLUMNS[key];
        let value = this.props.holding[column.selector];
        if (column.formatFunction) {
            return column.formatFunction(this.props.holding, column);
        }
        return column.filter ? column.filter(value) : value;
    }

    render() {
        return (
            <tr>
                {Object.keys(PERFORMANCE_COLUMNS).map(key => {
                    return (
                        <td key={key}>
                            {this.renderCell(key)}
                        </td>
                    );
                })}
            </tr>
        );
    }
}

export default PerformanceTableRow;