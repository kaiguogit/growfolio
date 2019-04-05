import React from 'react';
import PropTypes from 'prop-types';

import { TSCS_COLUMNS } from './columns';
import TableCategory from '../shared/table/TableCategory.jsx';
import TscActionButton from './TscActionButton.jsx';
import TableCell from '../shared/table/TableCell.jsx';

const TscsTable = ({holdings, displayCurrency, startDate, endDate}) => {
    const categoryTitle = holding => {
        const render = () => {
            return (
                <span>
                    {holding.symbol + ': ' + holding.name}
                    &nbsp;
                    {holding.unfoundRate &&
                        <span style={{color: 'red'}}>
                            <i className="fa fa-warning" aria-hidden="true"/>
                            <span>
                                There is a transaction with unfound rate
                            </span>
                        </span>
                    }
                </span>
            );
        };
        return render;
    };
    const filterTsc = tsc => {
        return (tsc.date.isBefore(endDate, 'day') || tsc.date.isSame(endDate, 'day')) &&
            (tsc.date.isAfter(startDate, 'day') || tsc.date.isSame(startDate, 'day'));
    };

    const filterHolding = holding => {
        return holding.transactions.filter(filterTsc).length;
    };

    return (
        <table className="table table-sticky-first-column table-responsive table-bordered table-sm table-compact">
            <thead>
                <tr>
                    {TSCS_COLUMNS.map(column => {
                        return (
                            <th key={column.selector}>
                                {column.title}
                            </th>
                        );
                    })}
                    <th>Delete</th>
                </tr>
            </thead>
            {holdings.filter(filterHolding).map(holding => {
                return (
                    <TableCategory
                        titleFn={categoryTitle(holding)}
                        columnsCount={TSCS_COLUMNS.length + 1}
                        key={holding.symbol}
                    >
                        {holding.transactions.filter(filterTsc).map(tsc => {
                            return <TscsRow tsc={tsc} key={tsc._id} displayCurrency={displayCurrency}/>;
                        })}
                    </TableCategory>
                );
            })}
        </table>
    );
};

TscsTable.propTypes = {
    holdings: PropTypes.array.isRequired,
    displayCurrency: PropTypes.string.isRequired,
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired
};

const TscsRow = ({tsc, displayCurrency}) => {
    return (
        <tr>
            {TSCS_COLUMNS.map(column => {
                return (
                    <TableCell
                        key={column.selector}
                        entry={tsc}
                        column={column}
                        displayCurrency={displayCurrency}
                    />
                );
            })}
            <td>
                <div className="tscs-action-buttons">
                    <TscActionButton type="edit" tsc={tsc}/>
                    <TscActionButton type="delete" tsc={tsc}/>
                </div>
            </td>
        </tr>
    );
};

TscsRow.propTypes = {
    tsc: PropTypes.object.isRequired,
    displayCurrency: PropTypes.string.isRequired,
};

export default TscsTable;