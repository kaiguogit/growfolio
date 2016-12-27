import React, { PropTypes } from 'react';

import { PERFORMANCE_COLUMNS } from '../constants';
import { Table } from 'react-bootstrap';
import PerformanceTableRow from '../containers/PerformanceTableRow.jsx';


class PerformanceTable extends React.Component {
    static propTypes = {
        symbols: PropTypes.array.isRequired
    };

    render() {
        return (
            <Table bordered hover>
                <thead>
                    <tr>
                        {PERFORMANCE_COLUMNS.map(columnName => {
                            return (
                                <th key={columnName}>
                                    {columnName}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {this.props.symbols.map(symbol => {
                        return (
                            <PerformanceTableRow key={symbol} symbol={symbol} />
                        );
                    })}
                </tbody>
            </Table>
        );
    }
}

export default PerformanceTable;