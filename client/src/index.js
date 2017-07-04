/* eslint-disable import/default */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore';
import { syncHistoryWithStore } from 'react-router-redux';

 // Tell webpack to load favicon.ico
require('./favicon.ico');
// Font Awesome
// https://blog.webjeda.com/optimize-fontawesome/
// TODO delete unused icons
// Great site to select fonts https://icomoon.io/app/
import './styles/font-awesome-4.7.0/css/font-awesome.min.css';
// NProgress
import 'nprogress/nprogress.css';
// Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.

import 'jquery';
// Bootstrap 4.x
import './styles/vendor/bootstrap/bootstrap';
import './styles/application.scss';

const store = configureStore();
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        <Router history={history} routes={routes(store)} />
    </Provider>, document.getElementById('app')
);