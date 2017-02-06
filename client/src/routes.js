import App from './components/App.jsx';
import Portfolio from './containers/Portfolio.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import Tscs from './containers/Tscs.jsx';
import Performance from './containers/Performance/Performance.jsx';
import Balance from './containers/Balance/Balance.jsx';
import SignUpPage from './components/SignUp/SignUpPage.jsx';
import LoginPage from './components/Login/LoginPage.jsx';
import Auth from './services/Auth';
import * as navigation from './constants/navigation';

const requireAuth = (nextState, replace) => {
  if (!Auth.loggedIn()) {
    replace({
        pathname: '/login',
        state: {nextPathname: nextState.location.pathname}
    });
  }
};

const routes = (/*store*/) => {
    return {
        path: '/',
        component: App,
        indexRoute: {
            onEnter: (nextState, replace) => {replace('/portfolio');},
        },
        childRoutes: [
            {
                path: 'portfolio',
                component: Portfolio,
                indexRoute: {component: Performance},
                onEnter: requireAuth,
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
            {   path: 'logout',
                onEnter: (nextState, replace) => {
                    Auth.deauthenticateUser();
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
