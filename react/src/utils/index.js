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
