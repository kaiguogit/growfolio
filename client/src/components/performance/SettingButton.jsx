import React from 'react';
import { browserHistory } from 'react-router';

const onClick = () => {
    browserHistory.push('/portfolio/setting');
};

const SettingButton = () => (
    <div className="d-inline-block">
        <button type="button" className="btn btn-outline-primary" onClick={onClick}>
            <i className="fa fa-cog fa-lg" aria-hidden="true"/>
            {' '}
            Setting
        </button>
    </div>
);

export default SettingButton;