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
        filter: currency(3),
        title: 'Cost',
        className: 'hidden-sm-down'
    },
    {
        selector: 'mkt_value',
        filter: currency(3),
        title: 'Market Value',
        className: 'hidden-sm-down'
    },
    {
        selector: 'average_cost',
        filter: currency(3),
        title: 'Average Cost',
        className: 'hidden-sm-down'
    },
    {
        selector: 'price',
        filter: currency(3),
        title: 'Price'
    },
    {
        selector: 'shares',
        title: 'Shares',
        className: 'hidden-sm-down'
    },
    {
        selector: 'change',
        filter: currency(2),
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
        filter: currency(2),
        formatFunction: coloredCell,
        title: 'Day\'s Gain',
        className: 'font-weight-bold'
    },
    {
        selector: 'gain',
        filter: currency(2),
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
        filter: currency(2),
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
        filter: currency(2),
        formatFunction: coloredCell,
        title: 'Realized Gain'
    },
    {
        selector: 'dividend',
        filter: currency(2),
        formatFunction: coloredCell,
        title: 'Dividend',
        className: 'hidden-sm-down'
    },
    {
        selector: 'cost_overall',
        filter: currency(2),
        title: 'Overall Cost',
        className: 'hidden-sm-down'
    }
];
