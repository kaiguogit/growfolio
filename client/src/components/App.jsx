import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from './Header.jsx';
import Portfolio from './Portfolio.jsx';
import SignUpPage from './SignUp/SignUpPage.jsx';
import LoginPage from './Login/LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import Auth from '../services/Auth';


// https://reacttraining.com/react-router/web/example/auth-workflow
const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            Auth.loggedIn() ? (
                <Component {...props} />
            ) : (
                    <Redirect to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }} />
                )
        )} />
    );
};

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.
class App extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <div className="layout-main-content">
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/portfolio/performance" />} />
                        <PrivateRoute path="/portfolio" component={Portfolio} />
                        <Route path="/signup" component={SignUpPage} />
                        <Route path="/login" component={LoginPage} />
                        <Route component={NotFoundPage}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;