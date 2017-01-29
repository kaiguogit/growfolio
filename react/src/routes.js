import App from './components/App.jsx';
import HomePage from './components/HomePage.jsx';
import Portfolio from './containers/Portfolio.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';

import * as navigation from './constants/navigation';
import * as actions from './actions';

const routes = (store) => {
    const onEnterPortfolio = (nextState, replace) => {
        const tab = nextState.params.tab;
        if (!tab) {
            replace('/portfolio/' + navigation.TAB_PERFORMANCE);
        }
        const selectedTab = store.getState().portfolio.tab;
        const isValid = Object.values(navigation).some(value => value === tab);
        // keep state and url params in sync.
        if (isValid && tab !== selectedTab) {
            store.dispatch(actions.selectTab(tab));
        }
        if (!isValid && tab) {
            replace('/error');
        }
    };

    return {
        path: '/',
        component: App,
        indexRoute: {component: HomePage},
        childRoutes:[
            {
                path: 'portfolio(/:tab)',
                component: Portfolio,
                onEnter: onEnterPortfolio
            },
            {
                path: 'error',
                component: NotFoundPage
            },
            {
                path: '*',
                component: NotFoundPage
            },
        ]
    };
};
export default routes;
