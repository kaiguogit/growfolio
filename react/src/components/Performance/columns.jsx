import React from 'react';
import { percentage, currency } from '../../utils';
import styles from '../../styles';

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

export const PERFORMANCE_COLUMNS = [
    {
        selector: 'symbol',
        title: 'Symbol'
    },
    {
        selector: 'cost',
        filter: currency,
        title: 'Cost'
    },
    {
        selector: 'average_cost',
        filter: currency,
        title: 'Average Cost'
    },
    {
        selector: 'shares',
        title: 'Shares'
    },
    {
        selector: 'mkt_value',
        filter: currency,
        title: 'Market Value'
    },
    {
        selector: 'price',
        filter: currency,
        title: 'Price'
    },
    {
        selector: 'change',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Change'
    },
    {
        selector: 'change_percent',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Change Percent'
    },
    {
        selector: 'days_gain',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Day\'s Gain'
    },
    {
        selector: 'gain',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Gain'
    },
    {
        selector: 'gain_percent',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Gain Percent'
    },
    {
        selector: 'gain_overall',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Overall Return'
    },
    {
        selector: 'realized_gain',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Realized Gain'
    },
    {
        selector: 'cost_overall',
        filter: currency,
        title: 'Overall Cost'
    }
];
