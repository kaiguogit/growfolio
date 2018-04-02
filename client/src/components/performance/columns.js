import { percentage, currency, coloredCell } from '../../utils';

const defaultColumn = {
    // ref_selector: 'daysGain'
};

const PERFORMANCE_COLUMNS = [
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
        filter: currency(2),
        title: 'Cost',
        className: 'hidden-sm-down'
    },
    {
        selector: 'mkt_value',
        filter: currency(2),
        title: 'Market Value',
    },
    {
        selector: 'averageCost',
        filter: currency(2),
        title: 'Average Cost',
        className: 'hidden-sm-down'
    },
    {
        selector: 'price',
        filter: currency(2),
        title: 'Price'
    },
    {
        selector: 'shares',
        title: 'Shares',
    },
    {
        selector: 'change',
        filter: currency(2),
        formatFunction: coloredCell,
        title: 'Change',
        className: 'font-weight-bold'
    },
    {
        selector: 'changePercent',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Change Percent',
        className: 'font-weight-bold',
        ref_selector: 'change'
    },
    {
        selector: 'daysGain',
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
        selector: 'gainPercent',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Gain Percent'
    },
    {
        selector: 'gainOverall',
        filter: currency(2),
        formatFunction: coloredCell,
        title: 'Overall Return',
        className: 'hidden-sm-down'
    },
    {
        selector: 'gainOverallPercent',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Overall Return Percent',
        className: 'hidden-sm-down'
    },
    {
        selector: 'realizedGain',
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
        selector: 'costOverall',
        filter: currency(2),
        title: 'Overall Cost',
        className: 'hidden-sm-down'
    }
];

PERFORMANCE_COLUMNS.forEach(column => {
    Object.keys(defaultColumn).forEach(key => {
        column[key] = column[key] || defaultColumn[key];
    });
});

export default PERFORMANCE_COLUMNS;