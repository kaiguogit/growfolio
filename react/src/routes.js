import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import App from './components/App.jsx';
import HomePage from './components/HomePage.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';

import * as navigation from './constants/navigation';
import * as actions from './actions';

const getRoutes = (store) => {
    const onEnterPortfolio = (nextState) => {
        const tab = nextState.params.tab;
        const selectedTab = store.getState().portfolio.tab;
        const isValid = Object.values(navigation).some(value => value === tab);
        // keep state and url params in sync.
        if (isValid && tab !== selectedTab) {
            store.dispatch(actions.selectTab(tab));
        }
    };

    return (
        <Route path="/" component={App}>
            <IndexRedirect to={`/portfolio/${navigation.TAB_PERFORMANCE}`}/>
            <Route path="portfolio(/:tab)" component={HomePage} onEnter={onEnterPortfolio}/>
            <Route path="*" component={NotFoundPage}/>
        </Route>
    );
};

export default getRoutes;
