import React from 'react';
import PropTypes from 'prop-types';

import NumberChangeTransition from '../../Animation/NumberChangeTransition.jsx';
import {getDollarValue} from '../../../utils';

const processData = (entry, column, currency) => {
    let value, filteredValue, refValue, content;
    let ref_selector = column.ref_selector;
    let selector = column.selector;
    let valueFunction = column.valueFunction;
    if (valueFunction) {
        const valueResult = valueFunction(entry);
        value = valueResult && valueResult[currency] || 0;
        refValue = value;
    } else {
        value = getDollarValue(entry, selector, currency);
        if (ref_selector) {
            refValue = getDollarValue(entry, ref_selector, currency);
        } else {
            refValue = value;
        }
    }
    if (typeof refValue === 'object') {
        refValue = refValue.toString();
    }
    filteredValue = column.filter ? column.filter(value) : value;
    content = column.formatFunction ? column.formatFunction(entry, filteredValue, refValue) : filteredValue;
    return {
        value,
        filteredValue,
        refValue,
        content
    };
};

const TableCell = ({entry, column, displayCurrency}) => {
    let refValue, content, otherContent;
    let otherCurrency = displayCurrency === 'CAD' ? 'USD' : 'CAD';
    let showOtherCurrency = column.showOtherCurrency && entry.currency !== displayCurrency;


    const processedResult = processData(entry, column, displayCurrency);
    content = processedResult.content;
    refValue = processedResult.refValue;
    if (showOtherCurrency) {
        const processedResult = processData(entry, column, otherCurrency);
        otherContent = processedResult.content;
    }
    let cellStyle = column.cellStyle;
    cellStyle = typeof cellStyle === 'function' ? cellStyle(entry) : cellStyle;
    return (
        <td className={column.className} style={cellStyle}>
            <NumberChangeTransition data={refValue}>
                <span>
                    {!showOtherCurrency && content}
                    {showOtherCurrency && content && otherContent &&
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
