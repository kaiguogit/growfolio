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
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Cost',
        className: 'hidden-sm-down',
        supportTotal: true
    },
    {
        selector: 'mktValue',
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Market Value',
        supportTotal: true
    },
    {
        selector: 'quoteDate',
        title: 'Market Time'
    },
    {
        selector: 'averageCost',
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Average Cost',
        className: 'hidden-sm-down'
    },
    {
        selector: 'price',
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Price'
    },
    {
        selector: 'shares',
        title: 'Shares',
    },
    {
        selector: 'change',
        showOtherCurrency: true,
        filter: currency(2),
        formatFunction: coloredCell,
        title: 'Change',
        className: 'font-weight-bold',
    },
    {
        selector: 'changePercent',
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Change Percent',
        className: 'font-weight-bold',
        ref_selector: 'change',
        supportTotal: true
    },
    {
        selector: 'daysGain',
        showOtherCurrency: true,
        filter: currency(2),
        formatFunction: coloredCell,
        title: 'Day\'s Gain',
        className: 'font-weight-bold',
        supportTotal: true
    },
    {
        selector: 'gain',
        showOtherCurrency: true,
        filter: currency(2),
        formatFunction: coloredCell,
        title: 'Gain',
        supportTotal: true
    },
    {
        selector: 'gainPercent',
        showOtherCurrency: true,
        filter: percentage,
        formatFunction: coloredCell,
        title: 'Gain Percent',
        supportTotal: true
    },
    {
        selector: 'gainOverall',
        showOtherCurrency: true,
        filter: currency(2),
        formatFunction: coloredCell,
        title: 'Overall Return',
        className: 'hidden-sm-down',
        supportTotal: true
    },
    {
        selector: 'realizedGain',
        showOtherCurrency: true,
        filter: currency(2),
        formatFunction: coloredCell,
        title: 'Realized Gain',
        supportTotal: true
    },
    {
        selector: 'dividend',
        showOtherCurrency: true,
        filter: currency(2),
        formatFunction: coloredCell,
        title: 'Dividend',
        className: 'hidden-sm-down',
        supportTotal: true
    }
];

export const TAX_COLUMNS = [
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
        selector: 'realizedGain2018',
        valueFunction: entry => entry.realizedGainYearly.map['2018'],
        formatFunction: coloredCell,
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Realized Gain 2018',
        className: 'hidden-sm-down',
        supportTotal: true
    },
    {
        selector: 'capitalGain2018',
        valueFunction: entry => entry.capitalGainYearly.map['2018'],
        formatFunction: coloredCell,
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Capital Gain 2018',
        className: 'hidden-sm-down',
        supportTotal: true
    },
    {
        selector: 'dividend2018',
        valueFunction: entry => entry.dividendYearly.map['2018'],
        formatFunction: coloredCell,
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Dividend 2018',
        className: 'hidden-sm-down',
        supportTotal: true
    },
    {
        selector: 'realizedGain2017',
        valueFunction: entry => entry.realizedGainYearly.map['2017'],
        formatFunction: coloredCell,
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Realized Gain 2017',
        className: 'hidden-sm-down',
        supportTotal: true
    },
    {
        selector: 'capitalGain2017',
        valueFunction: entry => entry.capitalGainYearly.map['2017'],
        formatFunction: coloredCell,
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Capital Gain 2017',
        className: 'hidden-sm-down',
        supportTotal: true
    },
    {
        selector: 'dividend2017',
        valueFunction: entry => entry.dividendYearly.map['2017'],
        formatFunction: coloredCell,
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Dividend 2017',
        className: 'hidden-sm-down',
        supportTotal: true
    },
    {
        selector: 'realizedGain2016',
        valueFunction: entry => entry.realizedGainYearly.map['2016'],
        formatFunction: coloredCell,
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Realized Gain 2016',
        className: 'hidden-sm-down',
        supportTotal: true
    },
    {
        selector: 'capitalGain2016',
        valueFunction: entry => entry.capitalGainYearly.map['2016'],
        formatFunction: coloredCell,
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Capital Gain 2016',
        className: 'hidden-sm-down',
        supportTotal: true
    },
    {
        selector: 'dividend2016',
        valueFunction: entry => entry.dividendYearly.map['2016'],
        formatFunction: coloredCell,
        showOtherCurrency: true,
        filter: currency(2),
        title: 'Dividend 2016',
        className: 'hidden-sm-down',
        supportTotal: true
    }
];