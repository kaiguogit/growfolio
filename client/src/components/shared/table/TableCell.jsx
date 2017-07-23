import React from 'react';
import PropTypes from 'prop-types';

import NumberChangeTransition from '../../Animation/NumberChangeTransition.jsx';

const TableCell = ({entry, column}) => {
    let value = entry[column.selector];
    let refValue = entry[column.ref_selector];
    let content;
    const filter = value => {
        return column.filter ? column.filter(value) : value;
    }
    let filteredValue = filter(value);
    if (column.formatFunction) {
        content = column.formatFunction(entry, column);
    } else {
        content = <span>{filteredValue}</span>;
    }
    return (
        <td className={column.className}>
            <NumberChangeTransition
                data={column.ref_selector ? refValue : value}>
                {content}
            </NumberChangeTransition>
        </td>
    );
};

TableCell.propTypes = {
    entry: PropTypes.object.isRequired,
    column: PropTypes.object.isRequired
};

export default TableCell;
