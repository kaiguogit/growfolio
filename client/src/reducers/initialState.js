import moment from 'moment';

export default {
    portfolio: {
        displayCurrency: 'CAD',
        displayAccount: 'all',
        showZeroShareHolding: false
    },
    tscs: {
        isFetching: false,
        items: [],
        deleteTscModalData: {
            isOpened: false,
            tsc: null
        },
        dialogModal: {
            isOpened: false,
            tsc: null
        },
        lastUpdated: Date.now()
    },
    quotes: {
        isFetching: false,
        data: {},
        meta: {},
        displayDate: moment(),
        lastUpdated: Date.now(),
        useHistoricalQuote: false,
        dialogModal: {
            isOpened: false,
            quote: null
        }
    },
    currency: {
        isFetching: false,
        rate: {
            USDCAD: 1
        },
        // TODO support CRUD watch list
        watchList: ['CNY', 'USD'],
        lastUpdated: Date.now()
    },
    symbols: {
        isFetching: false,
        items: [],
        query: '',
        lastUpdated: Date.now()
    },
    balance: {},
    auth: {
        signup: {
            errors: {},
            isFetching: false,
            success: false,
            message: ''
        },
        login: {
            errors: {},
            isFetching: false,
            success: false,
            message: '',
            user: {}
        }
    }
};