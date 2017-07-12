import React from 'react';
import numeral from 'numeral';
import Auth from '../services/Auth';
import styles from '../styles';
import './promise';
/**
 * round number by digits
 * http://www.javascriptkit.com/javatutors/round.shtml
 * @param {Number} digit, round at last x decimal
 */
export const round = (value, digit) => {
    let multiplier = Math.pow(10, digit);
    return Math.round(value * multiplier) / multiplier;
};

/**
 * Convert string to number with numeral library
 * @param {string|number} n
 */
export const num = (n) => numeral(n).value();

/**
 * Convert value to number for provided keys in object.
 * If it's not a finite number, i.e NaN or Infinity, use 0
 * @param {array} keys
 * @param {object} obj
 */
export const avoidNaN = (keys, obj) => {
    let result;
    keys.forEach(key => {
        if (key in obj) {
            result = num(obj[key]);
            obj[key] = isFinite(result) ? result : 0;
        }
    });
};
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

/** Create function that round number return string value
 * @param {number} decimal - number of decimal digit to round
 * @return {function}
 */
export const currency = decimal => number => {
    if (decimal === undefined) {
        decimal = 2;
    }
    try {
        return numeral(round(number, decimal)).format(`0,0[.][${'0'.repeat(decimal)}]`);
    }
    catch(e) {
        return number;
    }
};

// http://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off#answer-14569783
// Convert UTC to local date
export const date = dateStr => {
    try {
        let doo = new Date(dateStr);
        let adjustedTime = new Date(doo.getTime() + Math.abs(doo.getTimezoneOffset()*60000));
        return adjustedTime.toLocaleDateString();
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

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
export const escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

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

export const getHeaders = () => new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${Auth.getToken()}`
});

// Safely divide
// https://stackoverflow.com/questions/8072323/best-way-to-prevent-handle-divide-by-0-in-javascript
export const divide = (a, b) => {
    const result = num(a) / num(b);
    if (isFinite(result)) {
        return result;
    }
    return 0;
};

/**
 * Generate red or green style based on whether number is positive.
 *
 * @param {number} value
 * @returns {object} A style object used for component style property
 */
export const redOrGreen = (value) => {
    let style;
    if (value > 0) {
        style = styles.up;
    } else if (value < 0) {
        style = styles.down;
    }
    return style;
};

export const coloredCell = (entry, column) => {
    let refValue = column.ref_selector ? entry[column.ref_selector] : entry[column.selector];
    let value = entry[column.selector];

    return (
        <span style={redOrGreen(refValue)}>
            {column.filter ? column.filter(value) : value}
        </span>
    );
};

export const renderCell = (entry, column) => {
    let value = entry[column.selector];
    let content;
    let filteredValue = column.filter ? column.filter(value) : value;
    if (column.formatFunction) {
        content = column.formatFunction(entry, column);
    } else {
        content = filteredValue;
    }
    return (
        <span style={column.style} key={filteredValue}>
            {content}
        </span>
    );
};
