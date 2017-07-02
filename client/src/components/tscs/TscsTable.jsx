import React, { PropTypes } from 'react';

import { TSCS_COLUMNS } from './columns';
import { renderCell } from '../../utils';
import TableCategory from '../../utils/table/TableCategory.jsx';
import DeleteTsc from './DeleteTsc.jsx';

const TscsTable = ({ holdings, isFetching }) => {
    return (
        <table className="table table-responsive table-bordered table-sm table-compact">
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
            {
                holdings.map(holding => {
                    return (
                        <TableCategory
                            title={holding.symbol + ': ' + holding.name}
                            columnsCount={TSCS_COLUMNS.length + 1}
                            key={holding.symbol}
                        >
                            {holding.transactions.map(tsc => {
                                return <TscsRow tsc={tsc} isFetching={isFetching} key={tsc._id}/>;
                            })}
                        </TableCategory>
                    );
                })
            }
        </table>
    );
};

TscsTable.propTypes = {
    holdings: PropTypes.array.isRequired,
    removeTscs: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired
};

const TscsRow = ({tsc, isFetching}) => {
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
                <DeleteTsc
                    onConfirm={() => this.props.removeTscs(tsc._id)}
                    id={tsc._id}
                    loading={isFetching}
                />
            </td>
        </tr>
    );
};

TscsRow.propTypes = {
    tsc: PropTypes.object.isRequired,
    isFetching: PropTypes.bool.isRequired
};

export default TscsTable;