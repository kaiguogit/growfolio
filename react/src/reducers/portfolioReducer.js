import * as types from '../constants/actionTypes';
import * as navigation from '../constants/navigation';

export const portfolioTab = (state = navigation.TAB_TSCS, action) => {
    switch (action.type) {
        case types.SELECT_TAB:
            return action.tab;
        default:
            return state;
    }
};
