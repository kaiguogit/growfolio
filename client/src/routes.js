import App from './components/App.jsx';
import Portfolio from './components/Portfolio.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import Base from './components/Base.jsx';
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
                indexRoute: {component: Portfolio},
                onEnter: requireAuth,
                childRoutes: [
                    {
                        path: 'setting',
                        component: Base,
                        indexRoute: {component: PerformanceSetting}
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
