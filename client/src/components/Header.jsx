import React from 'react';
import NavLink from './NavLink.jsx';
import Auth from '../services/Auth';

const Header = () => (
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
                <NavLink className="global-header-section-link" to="/portfolio" indexOnly={false}><span>Portfolio</span></NavLink>
            </div>
        </div>
        {Auth.loggedIn() ? (
            <div className="global-header-section mod-right">
                <span className="navbar-text">Hello, {Auth.getUser().name}</span>
                <NavLink className="global-header-section-button" to="/logout"><span>Log out</span></NavLink>
            </div>
        ) : (
            <div className="global-header-section mod-right">
                <NavLink className="global-header-section-button" to="/login">Log In</NavLink>
                <NavLink className="global-header-section-button mod-primary" to="/signup">Sign Up</NavLink>
            </div>
        )}
    </div>
);

export default Header;