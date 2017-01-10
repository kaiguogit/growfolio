import React from 'react';
import numeral from 'numeral';

/**
 * Filters
 */
export const percentage = number => {
    try {
        return numeral(number).format('0.00%');
    }
    catch(e) {
        return number;
    }
};

export const currency = number => {
    try {
        return numeral(number).format('0,0[.]00');
    }
    catch(e) {
        return number;
    }
};

export const date = dateStr => {
    try {
        return new Date(dateStr).toLocaleDateString();
    }
    catch(e) {
        return dateStr;
    }
};

export const capitalize = str => {
    return str[0].toUpperCase() + str.slice(1);
};
/**
 * Utilities
 */
export const errorHandler = error => {
    console.log(error);
};

const queryParams = (params) => {
    let esc = encodeURIComponent;
    return Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k]))
        .join('&');
};

export const makeUrl = (url, params) => {
    return url += (url.indexOf('?') === -1 ? '?' : '&') + queryParams(params);
};

export const renderCell = (entry, column) => {
    let value = entry[column.selector];
    let content;
    if (column.formatFunction) {
        content = column.formatFunction(entry, column);
    } else {
        content = column.filter ? column.filter(value) : value;
    }
    return (
        <div style={column.style}>
            {content}
        </div>
    );
};
