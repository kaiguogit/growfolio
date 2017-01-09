import React, { PropTypes } from 'react';

import { PERFORMANCE_COLUMNS } from './columns.jsx';
import { Table } from 'react-bootstrap';
import PerformanceTableRow from '../../containers/Performance/PerformanceTableRow.jsx';
import PerformanceTableRowTotal from '../../containers/Performance/PerformanceTableRowTotal.jsx';

class PerformanceTable extends React.Component {
    static propTypes = {
        symbols: PropTypes.array.isRequired
    };

    render() {
        const { symbols } = this.props;
        const isEmpty = symbols.length === 0;
        return (
            <div>
            {isEmpty ? <h2>Empty.</h2>
              : <Table bordered hover>
                    <thead>
                        <tr>
                            {PERFORMANCE_COLUMNS.map(column => {
                                return (
                                    <th key={column.selector}>
                                        {column.title}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        <PerformanceTableRowTotal/>
                        {this.props.symbols.map(symbol => {
                            return (
                                <PerformanceTableRow key={symbol} symbol={symbol} />
                            );
                        })}
                    </tbody>
                </Table>
            }
            </div>
        );
    }
}

export default PerformanceTable;