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

export class TaxColumns {
    constructor(year) {
        this.columns = [
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
                selector: `realizedGain${year}`,
                valueFunction: entry => entry.realizedGainYearly.map[year],
                formatFunction: coloredCell,
                showOtherCurrency: true,
                filter: currency(2),
                title: `Realized Gain ${year}`,
                className: 'hidden-sm-down',
                supportTotal: true
            },
            {
                selector: `capitalGain${year}`,
                valueFunction: entry => entry.capitalGainYearly.map[year],
                formatFunction: coloredCell,
                showOtherCurrency: true,
                filter: currency(2),
                title: `Capital Gain ${year}`,
                className: 'hidden-sm-down',
                supportTotal: true
            },
            {
                selector: `dividend${year}`,
                valueFunction: entry => entry.dividendYearly.map[year],
                formatFunction: coloredCell,
                showOtherCurrency: true,
                filter: currency(2),
                title: `Dividend ${year}`,
                className: 'hidden-sm-down',
                supportTotal: true
            }
        ];
    }
}