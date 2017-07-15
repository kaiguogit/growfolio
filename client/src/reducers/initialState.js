export default {
    portfolio: {
        displayCurrency: 'CAD',
        showZeroShareHolding: false
    },
    tscs: {
        isFetching: false,
        items: {},
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
        items: {},
        lastUpdated: Date.now()
    },
    currency: {
        isFetching: false,
        rate: [],
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