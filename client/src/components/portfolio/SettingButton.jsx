import React from 'react';

import { withRouter } from 'react-router-dom';

const SettingButton = withRouter(({ history }) => {

    // Programmatically navigate using react routerv4
    // https://stackoverflow.com/a/42121109
    const onClick = () => {
        history.push('/portfolio/setting');
    };
    return (
        <div className="d-inline-block">
            <button onClick={onClick}>
                <i className="fa fa-cog fa-lg" aria-hidden="true"/>
                <span className="ml-2">
                    Setting
                </span>
            </button>
        </div>
    );
});

export default SettingButton;