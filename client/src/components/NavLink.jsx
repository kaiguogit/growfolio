import React, { PropTypes } from 'react';
import { Link } from 'react-router';

class NavLink extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object
    };
    static propTypes = {
        to: PropTypes.string,
        children: PropTypes.element,
        indexOnly: PropTypes.bool
    }

    render() {
        const {to, children, indexOnly} = this.props;
        let isActive = this.context.router.isActive(to, indexOnly === undefined ? true : indexOnly);
        return (
            <div className="nav-item">
                <Link className={`nav-link ${(isActive ? 'active' : '')}`} to={to}>
                    {children}
                </Link>
            </div>
        );
    }
}

export default NavLink;