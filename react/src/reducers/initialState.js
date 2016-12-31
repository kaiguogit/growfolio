import * as navigation from '../constants/navigation';

export default {
    portfolio: {
        tab: navigation.TAB_PERFORMANCE,
        displayCurrency: 'CAD'
    },
    tscs: {
        isFetching: false,
        items: [],
        formOpened: false
    },
    quotes: {
        isFetching: false,
        items: {}
    },
    currency: {
        isFetching: false,
        rate: []
    },
    symbols: {
        isFetching: false,
        items: [],
        query: ''
    }
};