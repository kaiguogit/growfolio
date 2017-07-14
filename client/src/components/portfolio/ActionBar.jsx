import React from 'react';

import RefreshButton from './RefreshButton.jsx';
import SettingButton from './SettingButton.jsx';
import AddTscButton from './AddTscButton.jsx';

const ActionBar = () => (
    <div>
        <RefreshButton/>
        <SettingButton/>
        <AddTscButton/>
    </div>
);

export default ActionBar;