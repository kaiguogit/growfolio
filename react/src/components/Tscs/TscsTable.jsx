import React, { PropTypes } from 'react';

import { Table } from 'react-bootstrap';
import { TSCS_COLUMNS } from './columns';
import { renderCell } from '../../utils';

const COLUMNS = ['name', 'symbol', 'type', 'price', 'shares', 'commission', 'date'];

class TscsTable extends React.Component {
    static propTypes = {
        tscs: PropTypes.array.isRequired,
        removeTscs: PropTypes.func.isRequired
    }

    render() {
        const { tscs } = this.props;
        return (
            <Table bordered hover>
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
                <tbody>
                    {tscs.map(tsc => {
                        return (
                            <tr key={tsc._id}>
                                {TSCS_COLUMNS.map(column => {
                                    return (
                                        <td key={column.selector}>
                                            {renderCell(tsc, column)}
                                        </td>
                                    );
                                })}
                                <td>
                                    <button className="btn" onClick={() => this.props.removeTscs(tsc._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        );
    }
}

export default TscsTable;