import React from 'react';
import { Route, IndexRedirect } from 'react-router';

import App from './components/App.jsx';
import HomePage from './components/HomePage.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';

import * as navigation from './constants/navigation';
export default (
    <Route path="/" component={App}>
        <IndexRedirect to={`/portfolio/${navigation.TAB_PERFORMANCE}`}/>
        <Route path="portfolio(/:tab)" component={HomePage}/>
        <Route path="*" component={NotFoundPage}/>
    </Route>
);
