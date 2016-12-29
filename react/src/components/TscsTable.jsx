import React, { PropTypes } from 'react';

import { Table } from 'react-bootstrap';

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
                        {COLUMNS.map(columnName => {
                            return (
                                <th key={columnName}>
                                    {columnName}
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
                                {COLUMNS.map(columnName => {
                                    return (
                                        <td key={columnName}>
                                            {tsc[columnName]}
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