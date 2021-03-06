import React from 'react';
import numeral from 'numeral';
import Auth from '../services/Auth';
import styles from '../styles';
import log from './log';
import {DollarValue} from '../selectors/transaction';

export {log};

/**
 * Wrapper function to try and catch provided callback.
 */
export const makeSafe = (fn) => {
    return (...args) => {
        try {
            return fn.apply(null, args);
        } catch (e) {
            log.error('Function ', fn, ' went wrong. \n Arguments: ', args, '\nError: ', e);
        }
    };
};

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
 * Convert value to number for single key in object.
 * If it's not a finite number, i.e NaN or Infinity, use 0
 * @param {string} key
 * @param {object} obj
 */
export const avoidNaN = (key, obj) => {
    let result;
    if (key in obj) {
        result = num(obj[key]);
        obj[key] = isFinite(result) && result ? result : 0;
    }
};

/**
 * Convert value to number for provided keys in object.
 * If it's not a finite number, i.e NaN or Infinity, use 0
 * @param {array} keys
 * @param {object} obj
 */
export const avoidNaNKeys = (keys, obj) => {
    keys.forEach(key => {
        avoidNaN(key, obj);
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
// Datepicker use momentjs to parse and set the time.
// By default moment use local timezone
// so selecting 4-27 in PDT browser will create a 4-27 17:00 PDT date
// which is 4-28 00:00 GMT. It's fine as long as we display it as 4-27 as
// well.
// Therefore, remove the old timeoffset workaround.
export const date = date => {
    // try {
    //     let doo = new Date(dateStr);
    //     let adjustedTime = new Date(doo.getTime() + Math.abs(doo.getTimezoneOffset()*60000));
    //     return adjustedTime.toLocaleDateString();
    // }
    // catch(e) {
    //     return dateStr;
    // }
    return date ? date.format('YYYY-MM-DD') : '';
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

export const getDollarValue = (obj, key, displayCurrency) => {
    if (obj[key] instanceof DollarValue) {
        return obj[key][displayCurrency];
    }
    return obj[key];
};

export const coloredCell = (entry, value, refValue) => {
    return (
        <span style={redOrGreen(refValue)}>
            {value}
        </span>
    );
};
