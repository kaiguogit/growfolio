import React from 'react';
import NavLink from './NavLink.jsx';

class NavBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
                <div className="navbar-header">
                    <div className="navbar-brand">Growfolio</div>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        <NavLink to="/" indexOnly={true}><span>Home</span></NavLink>
                        <NavLink to="/portfolio" indexOnly={false}><span>Portfolio</span></NavLink>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default NavBar;