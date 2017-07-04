import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
class NavLinkWrapper extends React.Component {

    render() {
        const {to, children, indexOnly, className} = this.props;
        return (
            <NavLink className={className} exact={indexOnly} activeClassName="active" to={to}>
                {children}
            </NavLink>
        );
    }
}

NavLink.contextTypes = {
    router: PropTypes.object
};
NavLink.propTypes = {
    to: PropTypes.string,
    children: PropTypes.element,
    // indexOnly: default is true
    //  ture: only match the exact path.
    //  false: every route in the route branch will be matched
    indexOnly: PropTypes.bool,
    className: PropTypes.string
};

export default NavLinkWrapper;

