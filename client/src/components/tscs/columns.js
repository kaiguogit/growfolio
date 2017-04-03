import { date, capitalize, currency, coloredCell } from '../../utils';

export const TSCS_COLUMNS = [
    {
        selector: 'name',
        title: 'Name'
    },
    {
        selector: 'exch',
        title: 'Exchange'
    },
    {
        selector: 'symbol',
        title: 'Symbol'
    },
    {
        selector: 'type',
        filter: capitalize,
        title: 'Type'
    },
    {
        selector: 'currency',
        title: 'Currency'
    },
    {
        selector: 'price',
        title: 'Price'
    },
    {
        selector: 'shares',
        title: 'Shares'
    },
    {
        selector: 'commission',
        title: 'Commission'
    },
    {
        selector: 'date',
        filter: date,
        title: 'Date'
    },
    {
        selector: 'total',
        title: 'Total',
        filter: currency(3)
    },
    {
        selector: 'acbChange',
        title: 'Change in ACB',
        filter: currency(3),
        formatFunction: coloredCell
    },
    {
        selector: 'newAcb',
        title: 'New ACB',
        filter: currency(3)
    },
    {
        selector: 'newAverageCost',
        filter: currency(3),
        title: 'Average Cost'
    },
    {
        selector: 'notes',
        title: 'Notes'
    }
];
