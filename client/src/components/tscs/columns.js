import { date, capitalize, coloredCell } from '../../utils';

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
        title: 'Total'
    },
    {
        selector: 'newAcb',
        title: 'New ACB'
    },
    {
        selector: 'acbChange',
        title: 'Change in ACB',
        formatFunction: coloredCell
    },
    {
        selector: 'newAverageCost',
        title: 'Average Cost'
    },
    {
        selector: 'notes',
        title: 'Notes'
    }
];
