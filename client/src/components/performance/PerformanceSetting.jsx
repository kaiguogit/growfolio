import React from 'react';
import { browserHistory } from 'react-router';
import CurrencySelector from './CurrencySelector.jsx';

const onClick = () => {
    browserHistory.push('/portfolio');
};

const GoBackButton = () => (
    <div>
        <button type="button" className="btn btn-outline-primary" onClick={onClick}>
            <i className="fa fa-arrow-left fa-lg" aria-hidden="true"/>
            {' '}
            Go back
        </button>
    </div>
);

const PerformanceSetting = () => {
    return (
        <div className="row justify-content-center">
            <div className="col-md-4">
                <CurrencySelector/>
                <GoBackButton/>
            </div>
        </div>

    );
};

export default PerformanceSetting;


