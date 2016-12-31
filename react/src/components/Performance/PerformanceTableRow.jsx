import React, { PropTypes } from 'react';
import { PERFORMANCE_COLUMNS } from './columns.jsx';
import NumberChangeTransition from '../Animation/NumberChangeTransition.jsx';
class PerformanceTableRow extends React.Component {
    static propTypes = {
        holding: PropTypes.object.isRequired
    }

    renderCell(column) {
        let value = this.props.holding[column.selector];
        if (column.formatFunction) {
            return column.formatFunction(this.props.holding, column);
        }
        return column.filter ? column.filter(value) : value;
    }

    transitionUpOrDown(value) {
        return value > 0 ? "background-green-fade-out" : "background-red-fade-out";
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
                                <div>
                                    {this.renderCell(column)}
                                </div>
                            </NumberChangeTransition>
                        </td>
                    );
                })}
            </tr>
        );
    }
}

export default PerformanceTableRow;