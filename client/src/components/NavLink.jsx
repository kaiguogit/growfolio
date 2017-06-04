import React, { PropTypes } from 'react';
import { Link } from 'react-router';

class NavLink extends React.Component {
    static contextTypes = {
        router: React.PropTypes.object
    };
    static propTypes = {
        to: PropTypes.string,
        children: PropTypes.element,
        // indexOnly: default is true
        //  ture: only match the exact path.
        //  false: every route in the route branch will be matched
        indexOnly: PropTypes.bool,
        className: PropTypes.string
    }

    render() {
        const {to, children, indexOnly, className} = this.props;
        let isActive = this.context.router.isActive(to, indexOnly === undefined ? true : indexOnly);
        return (
            <Link className={`${className} ${(isActive ? 'active' : '')}`} to={to}>
                {children}
            </Link>
        );
    }
}

export default NavLink;