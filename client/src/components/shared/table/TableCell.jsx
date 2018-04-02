import React from 'react';
import PropTypes from 'prop-types';

import NumberChangeTransition from '../../Animation/NumberChangeTransition.jsx';
import {getDollarValue} from '../../../utils';

const TableCell = ({entry, column, displayCurrency}) => {
    let value = getDollarValue(entry, column.selector, displayCurrency);
    let refValue = getDollarValue(entry, column.ref_selector, displayCurrency);
    let content;
    const filter = value => {
        return column.filter ? column.filter(value) : value;
    };
    let filteredValue = filter(value);
    if (column.formatFunction) {
        content = column.formatFunction(entry, column, displayCurrency);
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
    column: PropTypes.object.isRequired,
    displayCurrency: PropTypes.string.isRequired
};

export default TableCell;
