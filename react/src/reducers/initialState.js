import * as navigation from '../constants/navigation';

export default {
    portfolio: {
        tab: navigation.TAB_PERFORMANCE,
        displayCurrency: 'CAD'
    },
    tscs: {
        isFetching: false,
        items: [],
        formOpened: false,
        lastUpdated: Date.now()
    },
    quotes: {
        isFetching: false,
        items: {},
        lastUpdated: Date.now()
    },
    currency: {
        isFetching: false,
        rate: [],
        lastUpdated: Date.now()
    },
    symbols: {
        isFetching: false,
        items: [],
        query: '',
        lastUpdated: Date.now()
    },
    balance: {}
};