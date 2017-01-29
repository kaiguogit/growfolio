import React from 'react';
import { Link, IndexLink } from 'react-router';

class NavBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-default navbar-fixed-top" role="navigation">
                <div className="navbar-header">
                    <div className="navbar-brand">Growfolio</div>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        <li><IndexLink to="/">Home</IndexLink></li>
                        <li><Link to="/portfolio">Portfolio</Link></li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default NavBar;