import React, { PropTypes } from 'react';
import { PERFORMANCE_COLUMNS } from '../constants';

class PerformanceTableRow extends React.Component {
    static propTypes = {
        holding: PropTypes.object.isRequired
    }

    render() {
        const { holding } = this.props;
        return (
            <tr>
                {PERFORMANCE_COLUMNS.map(columnName => {
                    return (
                        <td key={columnName}>
                            {holding[columnName]}
                        </td>
                    );
                })}
            </tr>
        );
    }
}

export default PerformanceTableRow;