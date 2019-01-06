import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getHoldingsAfterZeroShareFilter } from '../../selectors';
import PerformanceTableRow from './PerformanceTableRow.jsx';
import PerformanceTableRowTotal from './PerformanceTableRowTotal.jsx';
import SummaryBar from './SummaryBar.jsx';
import {PERFORMANCE_COLUMNS} from './columns';

class PerformanceTable extends React.Component {
    render() {
        let { holdings} = this.props;

        const isEmpty = holdings.length === 0;
        return (
            <div>
            <SummaryBar/>
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
                        <PerformanceTableRowTotal columns={PERFORMANCE_COLUMNS}/>
                        {holdings.map(holding => {
                            return (
                                <PerformanceTableRow key={holding.symbol} symbol={holding.symbol}
                                    columns={PERFORMANCE_COLUMNS}/>
                            );
                        })}
                    </tbody>
                </table>
            }
            </div>
        );
    }
}

PerformanceTable.propTypes = {
    holdings: PropTypes.array.isRequired
};

const mapStateToProps = state => {
    return {
        holdings: getHoldingsAfterZeroShareFilter(state)
    };
};

export default connect(mapStateToProps)(PerformanceTable);