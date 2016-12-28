import React, { PropTypes } from 'react';

import { PERFORMANCE_COLUMNS } from './columns.jsx';
import { Table } from 'react-bootstrap';
import PerformanceTableRow from '../../containers/PerformanceTableRow.jsx';


class PerformanceTable extends React.Component {
    static propTypes = {
        symbols: PropTypes.array.isRequired
    };

    render() {
        return (
            <Table bordered hover>
                <thead>
                    <tr>
                        {Object.keys(PERFORMANCE_COLUMNS).map(key => {
                            return (
                                <th key={key}>
                                    {PERFORMANCE_COLUMNS[key].title}
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