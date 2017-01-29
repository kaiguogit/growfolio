import App from './components/App.jsx';
import HomePage from './components/HomePage.jsx';
import Portfolio from './containers/Portfolio.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import Tscs from './containers/Tscs.jsx';
import Performance from './containers/Performance/Performance.jsx';
import Balance from './containers/Balance/Balance.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import LoginPage from './containers/LoginPage.jsx';

import * as navigation from './constants/navigation';

//componets

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
                        path: navigation.PERFORMANCE,
                        component: Performance
                    },
                    {
                        path: navigation.TSCS,
                        component: Tscs
                    },
                    {
                        path: navigation.BALANCE,
                        component: Balance
                    },
                ]
            },
            {
                path: 'signup',
                component: SignUpPage
            },
            {
                path: 'login',
                component: LoginPage
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
