/* eslint-disable import/default */

import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import App from './components/App.jsx';

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

// Reselect tools
import * as ReselectTools from 'reselect-tools';

// ReselectTools.registerSelectors(selectors); // register string names for selectors

const store = configureStore();
ReselectTools.getStateWith(() => store.getState()); // allows you to get selector inputs and outputs

render(
    <Provider store={store}>
        <Router>
            <Route path="/" component={App}/>
        </Router>
    </Provider>, document.getElementById('app')
);
