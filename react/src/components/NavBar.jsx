import React from 'react';
import NavLink from './NavLink.jsx';

const NavBar = () => (
    <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
        <div className="navbar-header">
            <div className="navbar-brand">Growfolio</div>
        </div>
        <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav">
                <NavLink to="/"><span>Home</span></NavLink>
                <NavLink to="/portfolio" indexOnly={false}><span>Portfolio</span></NavLink>
            </ul>
            <ul className="nav navbar-nav navbar-right">
                <NavLink to="/login"><span>Login</span></NavLink>
                <NavLink to="/signup"><span>SignUp</span></NavLink>

            </ul>
        </div>
    </nav>
);

export default NavBar;