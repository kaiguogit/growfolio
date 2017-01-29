import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App.jsx';
import HomePage from './components/HomePage.jsx';
import Portfolio from './containers/Portfolio.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';

import * as navigation from './constants/navigation';
import * as actions from './actions';

const getRoutes = (store) => {
    const onEnterPortfolio = (nextState, replace) => {
        const tab = nextState.params.tab;
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

    return (
        <Route path="/" component={App}>
            <IndexRoute component={HomePage}/>
            <Route path="portfolio(/:tab)" component={Portfolio} onEnter={onEnterPortfolio}/>
            <Route path="error" component={NotFoundPage}/>
            <Route path="*" component={NotFoundPage}/>
        </Route>
    );
};

export default getRoutes;
