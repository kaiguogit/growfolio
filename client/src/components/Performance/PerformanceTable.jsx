import React, { PropTypes } from 'react';

import { PERFORMANCE_COLUMNS } from './columns.jsx';
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
              : <div className="table-responsive">
                  <table className="table table-striped table-bordered table-condensed">
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
                    </table>
                </div>
            }
            </div>
        );
    }
}

export default PerformanceTable;