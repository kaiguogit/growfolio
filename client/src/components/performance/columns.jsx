import { percentage, currency, coloredCell } from '../../utils';

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
