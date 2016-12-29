import React from 'react';
import { percentage, currency } from '../../utils';

const styles = {
    up: {
        color: '#093'
    },
    down: {
        color: '#d14836'
    }
};

const coloredCell = (entry, column) => {
    let value = entry[column.selector];
    let style;
    if (value > 0) {
        style = styles.up;
    } else if (value < 0) {
        style = styles.down;
    }

    return (
        <span style={style}>
            {column.filter ? column.filter(value) : value}
        </span>
    );
};

export const PERFORMANCE_COLUMNS = {
    'symbol': {
        selector: 'symbol',
        title: 'Symbol'
    },
    'cost': {
        selector: 'cost',
        filter: currency,
        title: 'Cost'
    },
    'average_cost': {
        selector: 'average_cost',
        filter: currency,
        title: 'Average Cost'
    },
    'shares': {
        selector: 'shares',
        title: 'Shares'
    },
    'mkt_value': {
        selector: 'mkt_value',
        filter: currency,
        title: 'Market Value'
    },
    'price': {
        selector: 'price',
        filter: currency,
        title: 'Price'
    },
    'change': {
        selector: 'change',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Change'
    },
    'change_percent': {
        selector: 'change_percent',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Change Percent'
    },
    'days_gain': {
        selector: 'days_gain',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Day\'s Gain'
    },
    'gain': {
        selector: 'gain',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Gain'
    },
    'gain_percent': {
        selector: 'gain_percent',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Gain Percent'
    },
    'gain_overall': {
        selector: 'gain_overall',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Overall Return'
    },
    'realized_gain': {
        selector: 'realized_gain',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Realized Gain'
    },
    'cost_overall': {
        selector: 'cost_overall',
        filter: currency,
        title: 'Overall Cost'
    }
};