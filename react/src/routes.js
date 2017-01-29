import App from './components/App.jsx';
import HomePage from './components/HomePage.jsx';
import Portfolio from './containers/Portfolio.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';

import * as navigation from './constants/navigation';

//componets
import Tscs from './containers/Tscs.jsx';
import Performance from './containers/Performance/Performance.jsx';
import Balance from './containers/Balance/Balance.jsx';

const routes = (/*store*/) => {
    return {
        path: '/',
        component: App,
        indexRoute: {component: HomePage},
        childRoutes: [
            {
                path: 'portfolio',
                component: Portfolio,
                indexRoute: {component: Performance},
                childRoutes: [
                    {
                        path: navigation.TAB_PERFORMANCE,
                        component: Performance
                    },
                    {
                        path: navigation.TAB_TSCS,
                        component: Tscs
                    },
                    {
                        path: navigation.TAB_BALANCE,
                        component: Balance
                    },
                ]
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
