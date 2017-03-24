import { date, capitalize } from '../../utils';

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
        selector: 'notes',
        title: 'Notes'
    }
];
