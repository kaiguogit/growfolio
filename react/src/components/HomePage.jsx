import React, { PropTypes } from 'react';
import * as navigation from '../constants/navigation';
import Portfolio from '../containers/Portfolio.jsx';
import NotFoundPage from './NotFoundPage.jsx';

const HomePage = ({ params }) => {
    const isTabExisting = (tab) => {
        return Object.values(navigation).some(value => value === tab);
    };

    return (
        <div className="container">
            {isTabExisting(params.tab) ?
                <Portfolio params={params}/> :
                <NotFoundPage/>
            }
        </div>
    );
};

HomePage.propTypes = {
    params: PropTypes.object.isRequired
};

export default HomePage;
