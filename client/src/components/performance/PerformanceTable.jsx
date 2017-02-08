import React, { PropTypes } from 'react';

import { PERFORMANCE_COLUMNS } from './columns.jsx';
import PerformanceTableRowContainer from './PerformanceTableRowContainer.jsx';
import PerformanceTableRowTotalContainer from './PerformanceTableRowTotalContainer.jsx';

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
              : <table className="table table-responsive table-striped table-bordered table-sm">
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
                        <PerformanceTableRowTotalContainer/>
                        {this.props.symbols.map(symbol => {
                            return (
                                <PerformanceTableRowContainer key={symbol} symbol={symbol} />
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