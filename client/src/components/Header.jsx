import React from 'react';
import NavLink from './NavLink.jsx';
import Auth from '../services/Auth';
import {withRouter, Link} from 'react-router-dom';
import DropdownMenu from './shared/dropdown-menu/dropdown-menu.jsx';

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
                 <DropdownMenu toggle={({onClick}) =>
                    <a className="global-header-section-button" onClick={onClick}>
                        {Auth.getUser().name}
                    </a>
                }>
                    <a onClick={() => {
                        history.push('/profile');
                        }}>
                        <span>Profile</span>
                    </a>
                    <a onClick={() => {
                        Auth.deauthenticateUser();
                        history.push('/');
                        }}>
                        <i className="fa fa-sign-out" aria-hidden="true"/>
                        <span>Log out</span>
                    </a>
                </DropdownMenu>
                <div className="dropdown d-inline-block">
                    <a className="global-header-section-button dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown">
                        {Auth.getUser().name}
                    </a>
                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                        <a href="#" className="dropdown-item" onClick={() => {
                            history.push('/profile');
                        }}>
                            <span>Profile</span>
                        </a>
                        <a href="#" className="dropdown-item" onClick={() => {
                            Auth.deauthenticateUser();
                            history.push('/');
                        }}>
                            <i className="fa fa-sign-out" aria-hidden="true"/>
                            <span>Log out</span>
                        </a>
                    </div>
                </div>
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