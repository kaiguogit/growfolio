import React, {PropTypes} from 'react';

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