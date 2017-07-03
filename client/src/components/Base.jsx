import React from 'react';
import PropTypes from 'prop-types';

const Base = ({children}) => {
    return (
        <div>
            {children}
        </div>
    );
};

Base.propTypes = {
    children: PropTypes.element
};

export default Base;