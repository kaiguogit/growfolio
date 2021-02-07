import React from 'react';
import {TaxColumns} from './columns';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getHoldingsAfterZeroShareFilter } from '../../selectors';
import PerformanceTableRow from './PerformanceTableRow.jsx';
import PerformanceTableRowTotal from './PerformanceTableRowTotal.jsx';
import SummaryBar from './SummaryBar.jsx';

class Tax extends React.Component {
    render() {
        let {holdings} = this.props;

        const isEmpty = holdings.length === 0;
        const years = Array.from(holdings.reduce((acc, holding) => {
            Object.keys(holding.capitalGainYearly.map).forEach(year => acc.add(year));
            return acc;
        }, new Set())).sort((a, b) => Number(b) - Number(a));
        return (
            <div>
            <SummaryBar/>
            <br/>
            {isEmpty ? <h2>Empty.</h2>
              : years.map(year => {
                  const taxColumns = new TaxColumns(year);
                  const columsn = taxColumns.columns;
                  return (
                    <React.Fragment key={year}>
                        <h3>{year}</h3>
                        <table className="table table-sticky-first-column table-responsive table-striped table-bordered table-sm table-compact">
                            <thead className="thead-default">
                                <tr>
                                    {columsn.map(column => {
                                        return (
                                            <th className={column.className} key={column.selector}>
                                                {column.title}
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                <PerformanceTableRowTotal columns={columsn}/>
                                {holdings.map(holding => {
                                    return (
                                        <PerformanceTableRow key={holding.symbol} symbol={holding.symbol}
                                            columns={columsn}/>
                                    );
                                })}
                            </tbody>
                        </table>
                    </React.Fragment>
                    );
                })
            }
            </div>
        );
    }
}

Tax.propTypes = {
    holdings: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired
};

const mapStateToProps = state => {
    return {
        holdings: getHoldingsAfterZeroShareFilter(state)
    };
};

export default connect(mapStateToProps)(Tax);