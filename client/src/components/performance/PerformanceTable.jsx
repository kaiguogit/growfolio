import React from 'react';
import PropTypes from 'prop-types';

import { PERFORMANCE_COLUMNS } from './columns.jsx';
import PerformanceTableRow from './PerformanceTableRow.jsx';
import PerformanceTableRowTotal from './PerformanceTableRowTotal.jsx';

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
              : <table className="table table-sticky-first-column table-responsive table-striped table-bordered table-sm table-compact">
                    <thead className="thead-default">
                        <tr>
                            {PERFORMANCE_COLUMNS.map(column => {
                                return (
                                    <th className={column.className} key={column.selector}>
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
                </table>
            }
            </div>
        );
    }
}

export default PerformanceTable;