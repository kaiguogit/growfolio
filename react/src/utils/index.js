import numeral from 'numeral';

/**
 * Filters
 */
export const percentage = number => {
    return numeral(number).format('0.00%');
};

export const currency = number => {
    return numeral(number).format('0,0[.]00');
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