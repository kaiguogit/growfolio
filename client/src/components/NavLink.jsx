import React from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';
class NavLinkWrapper extends React.Component {
    static contextTypes = {
        router: PropTypes.object
    };
    static propTypes = {
        to: PropTypes.string,
        children: PropTypes.node,
        // indexOnly: default is true
        //  ture: only match the exact path.
        //  false: every route in the route branch will be matched
        indexOnly: PropTypes.bool,
        className: PropTypes.string
    }

    render() {
        const {to, children, indexOnly, className} = this.props;
        return (
            <NavLink className={className} exact={indexOnly} activeClassName="active" to={to}>
                {children}
            </NavLink>
        );
    }
}

export default NavLinkWrapper;