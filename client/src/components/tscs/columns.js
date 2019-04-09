import { date, capitalize, currency, coloredCell } from '../../utils';
import React from 'react';
import styles from '../../styles';

export const CASH_COLUMNS = [
    {
        selector: 'total',
        title: 'Deposit',
        filter: currency(2),
        showOtherCurrency: true,
        formatFunction(tsc, filteredValue) {
            if (tsc.type === 'deposit') {
                return (<span style={styles.up}>{filteredValue}</span>);
            }
            return '';
        }
    },
    {
        selector: 'total',
        title: 'Withdraw',
        filter: currency(2),
        showOtherCurrency: true,
        formatFunction(tsc, filteredValue) {
            if (tsc.type === 'withdraw') {
                return (<span style={styles.down}>{filteredValue}</span>);
            }
            return '';
        }
    },
    {
        selector: 'currency',
        title: 'Currency'
    },
    {
        selector: 'date',
        filter: date,
        title: 'Date'
    },
];

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
        showOtherCurrency: true,
        filter: currency(4)
    },
    {
        selector: 'shares',
        title: 'Shares'
    },
    {
        selector: 'commission',
        title: 'Commission',
        showOtherCurrency: true,
        filter: currency(3)
    },
    {
        selector: 'date',
        filter: date,
        title: 'Date'
    },
    {
        selector: 'realizedGain',
        showOtherCurrency: true,
        title: 'Realized Gain',
        filter: currency(3),
        formatFunction: coloredCell
    },
    {
        selector: 'rate',
        title: 'Exchange Rate',
        formatFunction: entry =>{
            return entry.unfoundRate && 'Rate not found' || entry.rate;
        },
        cellStyle: entry => {
            if (entry.unfoundRate) {
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
