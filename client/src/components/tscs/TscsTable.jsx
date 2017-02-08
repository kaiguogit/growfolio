import React, { PropTypes } from 'react';

import { TSCS_COLUMNS } from './columns';
import { renderCell } from '../../utils';
import DeleteTsc from './DeleteTsc.jsx';

class TscsTable extends React.Component {
    static propTypes = {
        tscs: PropTypes.array.isRequired,
        removeTscs: PropTypes.func.isRequired,
        isFetching: PropTypes.bool.isRequired
    }

    render() {
        const { tscs, isFetching } = this.props;
        return (
            <table className="table table-responsive table-striped table-bordered table-sm">
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
                                    <DeleteTsc
                                        onConfirm={() => this.props.removeTscs(tsc._id)}
                                        id={tsc._id}
                                        loading={isFetching}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}

export default TscsTable;