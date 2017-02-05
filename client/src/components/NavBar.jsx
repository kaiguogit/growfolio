import React from 'react';
import NavLink from './NavLink.jsx';
import Auth from '../services/Auth';

const NavBar = () => (
    <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
        <div className="container">
            <div className="navbar-header">
                <div className="navbar-brand">Growfolio</div>
            </div>
            <div className="collapse navbar-collapse">
                <ul className="nav navbar-nav">
                    <NavLink to="/"><span>Home</span></NavLink>
                    <NavLink to="/portfolio" indexOnly={false}><span>Portfolio</span></NavLink>
                </ul>
                {Auth.loggedIn() ? (
                    <ul className="nav navbar-nav navbar-right">
                        <li><p className="navbar-text">{Auth.getUser().name}</p></li>
                        <NavLink to="/logout"><span>Log out</span></NavLink>
                    </ul>
                ) : (
                    <ul className="nav navbar-nav navbar-right">
                        <NavLink to="/login"><span>Log in</span></NavLink>
                        <NavLink to="/signup"><span>Sign Up</span></NavLink>
                    </ul>
                )}
            </div>
        </div>
    </nav>
);

export default NavBar;