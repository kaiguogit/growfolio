import React from 'react';
import PropTypes from 'prop-types';

import { TSCS_COLUMNS, CASH_COLUMNS } from './columns';
import TableCategory from './TableCategory.jsx';
import TscActionButton from './TscActionButton.jsx';
import TableCell from '../shared/table/TableCell.jsx';

const TscsTable = ({holdings, displayCurrency, startDate, endDate, cashTscs, totalCashTscs, collapse}) => {
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

    const columnsSize = Math.max(TSCS_COLUMNS.length, CASH_COLUMNS.length);
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
                        titleFn={categoryTitle(holding)}
                        columnsCount={columnsSize + 1}
                        key={holding.symbol}
                        symbol={holding.symbol}
                    >
                        <tbody style={collapse[holding.symbol] ? {display: 'none'} : {}}>
                            {holding.getValidTscs(startDate, endDate).map(tsc => {
                                return (<TscsRow tsc={tsc} key={tsc._id}
                                                columns={TSCS_COLUMNS}
                                                displayCurrency={displayCurrency}/>);
                            })}
                        </tbody>
                    </TableCategory>
                );
            })}
            {<TableCategory
                titleFn="Cash"
                columnsCount={columnsSize + 1}
                symbol="cash">
                <thead style={collapse.cash ? {display: 'none'} : {}}>
                    <tr>
                        {CASH_COLUMNS.map(column => {
                            return (
                                <th key={column.selector+column.title}>
                                    {column.title}
                                </th>
                            );
                        })}
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody style={collapse.cash ? {display: 'none'} : {}}>
                    {cashTscs.map(tsc => {
                        return (<TscsRow tsc={tsc} key={tsc._id}
                            columns={CASH_COLUMNS}
                            displayCurrency={displayCurrency}/>);
                    })}
                    {Object.entries(totalCashTscs).map(([currency, tsc]) => {
                        return (<TscsRow tsc={tsc} key={currency}
                            columns={CASH_COLUMNS}
                            displayCurrency={displayCurrency}/>);
                    })}
                </tbody>
            </TableCategory>}
        </table>
    );
};

TscsTable.propTypes = {
    holdings: PropTypes.array.isRequired,
    cashTscs: PropTypes.array.isRequired,
    totalCashTscs: PropTypes.object.isRequired,
    displayCurrency: PropTypes.string.isRequired,
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    collapse: PropTypes.object.isRequired
};

// PureComponent does shallow compare on props and state in shouldComponentUpdate().
// It can prevent row from re-rednering when collapse state changes.
// https://www.robinwieruch.de/react-prevent-rerender-component/
class TscsRow extends React.PureComponent {
    render() {
        const {tsc, displayCurrency, columns} = this.props;
        return (
            <tr>
                {columns.map(column => {
                    return (
                        <TableCell
                            key={column.selector+column.title}
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
    }
}

TscsRow.propTypes = {
    tsc: PropTypes.object.isRequired,
    displayCurrency: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired
};

export default TscsTable;