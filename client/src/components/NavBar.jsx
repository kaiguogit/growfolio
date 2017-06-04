import React from 'react';
import NavLink from './NavLink.jsx';
import Auth from '../services/Auth';
import { Link } from 'react-router';

const NavBar = () => (
    <nav id="header" className="navbar navbar-toggleable-sm">
        <button className="navbar-toggler navbar-toggler-right"
            type="button" data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"/>
        </button>
        <Link className="navbar-brand" to="/">Growfolio</Link>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="navbar-nav mr-auto">
                <NavLink to="/portfolio" indexOnly={false}><span>Portfolio</span></NavLink>
            </div>
            {Auth.loggedIn() ? (
                <div className="navbar-nav ml-auto">
                    <span className="navbar-text">Hello, {Auth.getUser().name}</span>
                    <NavLink to="/logout"><span>Log out</span></NavLink>
                </div>
            ) : (
                <div className="navbar-nav ml-auto">
                    <NavLink to="/login"><span>Log in</span></NavLink>
                    <NavLink to="/signup"><span>Sign Up</span></NavLink>
                </div>
            )}
        </div>
    </nav>
);

export default NavBar;