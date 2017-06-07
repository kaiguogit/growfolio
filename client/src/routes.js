import App from './components/App.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
// import Base from './components/Base.jsx';

import Portfolio from './components/Portfolio.jsx';
import Performance from './components/performance/Performance.jsx';
import TscsContainer from './components/tscs/TscsContainer.jsx';
import Balance from './components/balance/Balance.jsx';
import PerformanceSetting from './components/performance/PerformanceSetting.jsx';

import SignUpPage from './components/SignUp/SignUpPage.jsx';
import LoginPage from './components/Login/LoginPage.jsx';
import Auth from './services/Auth';
import {logout} from './actions/auth';

const requireAuth = (nextState, replace) => {
  if (!Auth.loggedIn()) {
    replace({
        pathname: '/login',
        state: {nextPathname: nextState.location.pathname}
    });
  }
};

const routes = (store) => {
    return {
        path: '/',
        component: App,
        indexRoute: {
            onEnter: (nextState, replace) => {replace('/portfolio');},
        },
        childRoutes: [
            {
                path: 'portfolio',
                indexRoute: {
                    onEnter: (nextState, replace) => {replace('/portfolio/performance');},
                },
                onEnter: requireAuth,
                childRoutes: [
                    {
                        path: 'setting',
                        component: PerformanceSetting,
                    },
                    {
                        // Since there isn't really a /portfolio page
                        // (always followed with child route), use
                        // Portfolio as component here with indexRoute
                        // component as children, so that above
                        // setting page can replace the portfolio
                        // instead of being its children
                        path: 'performance',
                        component: Portfolio,
                        indexRoute: {component: Performance}
                    },
                    {
                        path: 'transactions',
                        component: Portfolio,
                        indexRoute: {component: TscsContainer}
                    },
                    {
                        path: 'balance',
                        component: Portfolio,
                        indexRoute: {component: Balance}
                    }
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
            {   path: 'logout',
                onEnter: (nextState, replace) => {
                    Auth.deauthenticateUser();
                    store.dispatch(logout());
                    // change the current URL to /
                    replace('/');
                }
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
