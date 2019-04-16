import moment from 'moment-timezone';

export default {
    portfolio: {
        displayCurrency: 'CAD',
        displayAccount: 'all',
        showZeroShareHolding: false,
        startDate: moment().dayOfYear(1),
        endDate: moment()
    },
    tscs: {
        isFetching: false,
        items: [],
        collapse: {
            cash: true
        },
        filter: {
            type: ''
        },
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
        fetchingSymbol: '',
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
        data: {},
        realTimeRate: 1,
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