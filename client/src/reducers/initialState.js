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
        items: {},
        lastUpdated: Date.now()
    },
    currency: {
        isFetching: false,
        rate: [],
        annualAverageRate: {
            USD: {
                2017: 1.2986,
                2016: 1.2986
            }
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