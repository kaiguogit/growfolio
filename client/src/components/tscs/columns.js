import { date, capitalize, currency, coloredCell } from '../../utils';

export const TSCS_COLUMNS = [
    {
        selector: 'symbol',
        title: 'Symbol'
    },
    {
        selector: 'exch',
        title: 'Exchange'
    },
    {
        selector: 'type',
        filter: capitalize,
        title: 'Type'
    },
    {
        selector: 'account',
        title: 'Account'
    },
    {
        selector: 'currency',
        title: 'Currency'
    },
    {
        selector: 'price',
        title: 'Price',
        filter: currency(4)
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
        selector: 'realizedGain',
        selectorCAD: 'realizedGainCAD',
        title: 'Realized Gain',
        filter: currency(3),
        formatFunction: coloredCell
    },
    {
        selector: 'rate',
        title: 'Exchange Rate',
        formatFunction: entry =>{
            if (entry.currency === 'USD') {
                return entry.rate || 'Rate not found';
            }
        },
        cellStyle: entry => {
            if (entry.currency === 'USD' && !entry.rate) {
                return {
                    backgroundColor: 'red',
                    color: 'white'
                };
            }
        }
    },
    {
        selector: 'returnOfCapital',
        title: 'Return Of Capital',
        filter: currency(3)
    },
    {
        selector: 'capitalGain',
        title: 'Capital Gain',
        filter: currency(3)
    },
    {
        selector: 'total',
        showOtherCurrency: true,
        title: 'Total',
        filter: currency(3)
    },
    {
        selector: 'acbChange',
        showOtherCurrency: true,
        title: 'Change in ACB',
        filter: currency(3),
        formatFunction: coloredCell
    },
    {
        selector: 'newAcb',
        showOtherCurrency: true,
        title: 'New ACB',
        filter: currency(3)
    },
    {
        selector: 'newAverageCost',
        showOtherCurrency: true,
        filter: currency(3),
        title: 'Average Cost'
    },
    {
        selector: 'notes',
        title: 'Notes'
    }
];
