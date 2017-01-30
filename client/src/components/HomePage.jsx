import React, { PropTypes } from 'react';

const HomePage = () => {
    return (
        <div className="container">
            HomePage
        </div>
    );
};

HomePage.propTypes = {
    params: PropTypes.object.isRequired
};

export default HomePage;
