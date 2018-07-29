import React from 'react';

import RefreshButton from './RefreshButton.jsx';
import SettingButton from './SettingButton.jsx';
import AddTscButton from './AddTscButton.jsx';
import ExchangeRateButton from './ExchangeRate.jsx';

const ActionBar = () => (
    <div>
        <RefreshButton download={true}/>
        <RefreshButton download={false}/>
        <SettingButton/>
        <AddTscButton/>
        <ExchangeRateButton/>
    </div>
);

export default ActionBar;