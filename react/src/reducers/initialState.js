import * as navigation from '../constants/navigation';
import Auth from '../services/Auth';
export default {
    portfolio: {
        tab: navigation.PERFORMANCE,
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
    balance: {},
    auth: {
        signup: {
            isFetching: false,
            success: false,
            message: '',
            errors: {},
            user: {}
        },
        login: {
            isFetching: false,
            success: false,
            message: '',
            user: Auth.getUser()
        }
    }
};