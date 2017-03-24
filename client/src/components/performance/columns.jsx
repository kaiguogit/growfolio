import React from 'react';
import { percentage, currency } from '../../utils';
import styles from '../../styles';

const coloredCell = (entry, column) => {
    let refValue = column.ref_selector ? entry[column.ref_selector] : entry[column.selector];
    let value = entry[column.selector];
    let style;
    if (refValue > 0) {
        style = styles.up;
    } else if (refValue < 0) {
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
        title: 'Symbol',
        formatFunction: coloredCell,
        ref_selector: 'change'
    },
    {
        selector: 'currency',
        title: 'Currency',
        className: 'hidden-sm-down'
    },
    {
        selector: 'cost',
        filter: currency,
        title: 'Cost',
        className: 'hidden-sm-down'
    },
    {
        selector: 'mkt_value',
        filter: currency,
        title: 'Market Value',
        className: 'hidden-sm-down'
    },
    {
        selector: 'average_cost',
        filter: currency,
        title: 'Average Cost',
        className: 'hidden-sm-down'
    },
    {
        selector: 'price',
        filter: currency,
        title: 'Price'
    },
    {
        selector: 'shares',
        title: 'Shares',
        className: 'hidden-sm-down'
    },
    {
        selector: 'change',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Change',
        className: 'font-weight-bold'
    },
    {
        selector: 'change_percent',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Change Percent',
        className: 'font-weight-bold'
    },
    {
        selector: 'days_gain',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Day\'s Gain',
        className: 'font-weight-bold'
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
        filter: currency,
        formatFunction: coloredCell,
        title: 'Overall Return',
        className: 'hidden-sm-down'
    },
    {
        selector: 'gain_overall_percent',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Overall Return Percent',
        className: 'hidden-sm-down'
    },
    {
        selector: 'realized_gain',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Realized Gain'
    },
    {
        selector: 'dividend',
        filter: currency,
        formatFunction: coloredCell,
        title: 'Dividend',
        className: 'hidden-sm-down'
    },
    {
        selector: 'cost_overall',
        filter: currency,
        title: 'Overall Cost',
        className: 'hidden-sm-down'
    }
];