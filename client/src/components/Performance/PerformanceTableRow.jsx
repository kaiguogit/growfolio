import React, { PropTypes } from 'react';
import { PERFORMANCE_COLUMNS } from './columns.jsx';
import NumberChangeTransition from '../Animation/NumberChangeTransition.jsx';
import { renderCell } from '../../utils';
class PerformanceTableRow extends React.Component {
    static propTypes = {
        holding: PropTypes.object.isRequired
    }

    render() {
        return (
            <tr>
                {PERFORMANCE_COLUMNS.map(column => {
                        {/**
                          * We generate a unique key, e.g 'change-0.55' to make sure React create
                          * a new component on update to trigger 'Appear' animation
                          */}
                    return (
                        <td key={`${column.selector}-${this.props.holding[column.selector]}`}>
                            <NumberChangeTransition upOrDown={this.props.holding[column.selector] > 0}>
                                {renderCell(this.props.holding, column)}
                            </NumberChangeTransition>
                        </td>
                    );
                })}
            </tr>
        );
    }
}

export default PerformanceTableRow;