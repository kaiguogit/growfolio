import React from 'react';

import RefreshButton from './RefreshButton.jsx';
import SettingButton from './SettingButton.jsx';
import AddTscButton from './AddTscButton.jsx';
import ExchangeRateButton from './ExchangeRate.jsx';
import ToggleCollapse from './ToggleCollapse.jsx';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

const ActionBar = ({location}) => (
    <div>
        {location.pathname === '/portfolio/transactions'&& <ToggleCollapse/>}
        <RefreshButton download={true}/>
        <RefreshButton download={false}/>
        <SettingButton/>
        <AddTscButton/>
        <ExchangeRateButton/>
    </div>
);


ActionBar.propTypes = {
    location: PropTypes.object.isRequired
};

export default withRouter(ActionBar);