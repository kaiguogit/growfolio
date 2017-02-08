import App from './components/App.jsx';
import Portfolio from './components/Portfolio.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import TscsContainer from './components/tscs/TscsContainer.jsx';
import Performance from './components/performance/Performance.jsx';
import Balance from './components/balance/Balance.jsx';
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
                        component: TscsContainer
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
