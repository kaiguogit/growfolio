import React from 'react';
import PropTypes from 'prop-types';

import NumberChangeTransition from '../../Animation/NumberChangeTransition.jsx';
import {getDollarValue} from '../../../utils';

const TableCell = ({entry, column, displayCurrency}) => {
    let value, refValue, otherValue, content, otherContent, filteredValue, otherfilteredValue;
    let otherCurrency = displayCurrency === 'CAD' ? 'USD' : 'CAD';
    let showOtherCurrency = column.showOtherCurrency && entry.currency !== displayCurrency;
    let selector = column.selector;
    let ref_selector = column.ref_selector;
    value = getDollarValue(entry, selector, displayCurrency);
    if (ref_selector) {
        refValue = getDollarValue(entry, ref_selector, displayCurrency);
    } else {
        refValue = value;
    }
    if (typeof refValue === 'object') {
        refValue = refValue.toString();
    }
    filteredValue = column.filter ? column.filter(value) : value;
    content = column.formatFunction ? column.formatFunction(entry, column, displayCurrency) : filteredValue;
    if (showOtherCurrency) {
        otherValue = getDollarValue(entry, selector, otherCurrency);
        otherfilteredValue = column.filter ? column.filter(otherValue) : otherValue;
        otherContent = column.formatFunction ? column.formatFunction(entry, column, otherCurrency) : otherfilteredValue;
    }
    let cellStyle = column.cellStyle;
    cellStyle = typeof cellStyle === 'function' ? cellStyle(entry) : cellStyle;
    return (
        <td className={column.className} style={cellStyle}>
            <NumberChangeTransition data={refValue}>
                <span>
                    {!showOtherCurrency && content}
                    {showOtherCurrency &&
                        <div>
                            <div>{content}</div>
                            <div>{otherContent}({otherCurrency})</div>
                        </div>
                    }
                </span>
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
