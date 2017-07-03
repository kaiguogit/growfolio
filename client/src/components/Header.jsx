import React from 'react';
import NavLink from './NavLink.jsx';
import Auth from '../services/Auth';
import {withRouter, Link} from 'react-router-dom';
const Header = withRouter(({history}) => (
    <div className="global-header mod-trello-blue mod-dark-background u-clearfix">

        <div className="global-header-section mod-left">
            <NavLink className="global-header-section-logo" to="/">
            {/*
                Font is Pacifico
                https://editor.freelogodesign.org/?lang=en&logo=7b130f46-1b64-4b9f-84df-143846b9dd2f
                To convert PNG to SVG https://convertio.co/
            */}
                <img className="global-header-section-logo-image" src={
                    (__DEV__ ? '../styles' : '') + '/images/growfolio-logo-white.png'
                }/>
            </NavLink>
            <div className="global-header-section-links">
                <NavLink className="global-header-section-link" to="/portfolio"><span>Portfolio</span></NavLink>
            </div>
        </div>
        {Auth.loggedIn() ? (
            <div className="global-header-section mod-right">
                <span className="navbar-text">Hello, {Auth.getUser().name}</span>
                <a className="global-header-section-button" href="#" onClick={() => {
                    Auth.deauthenticateUser();
                    history.push('/');
                    }}><span>Log out</span></a>
            </div>
        ) : (
            <div className="global-header-section mod-right">
                <Link className="global-header-section-button" to="/login">Log In</Link>
                <Link className="global-header-section-button mod-primary" to="/signup">Sign Up</Link>
            </div>
        )}
    </div>
));

export default Header;