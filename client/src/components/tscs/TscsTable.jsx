import React from 'react';
import PropTypes from 'prop-types';

import { TSCS_COLUMNS } from './columns';
import { renderCell } from '../../utils';
import TableCategory from '../../utils/table/TableCategory.jsx';
import DeleteTscButton from './DeleteTscButton.jsx';

const TscsTable = ({holdings}) => {
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
            {holdings.map(holding => {
                return (
                    <TableCategory
                        title={holding.symbol + ': ' + holding.name}
                        columnsCount={TSCS_COLUMNS.length + 1}
                        key={holding.symbol}
                    >
                        {holding.transactions.map(tsc => {
                            return <TscsRow tsc={tsc} key={tsc._id}/>;
                        })}
                    </TableCategory>
                );
            })}
        </table>
    );
};

TscsTable.propTypes = {
    holdings: PropTypes.array.isRequired,
};

const TscsRow = ({tsc}) => {
    return (
        <tr>
            {TSCS_COLUMNS.map(column => {
                return (
                    <td key={column.selector}>
                        {renderCell(tsc, column)}
                    </td>
                );
            })}
            <td>
                <DeleteTscButton tscId={tsc._id}/>
            </td>
        </tr>
    );
};

TscsRow.propTypes = {
    tsc: PropTypes.object.isRequired,
};

export default TscsTable;