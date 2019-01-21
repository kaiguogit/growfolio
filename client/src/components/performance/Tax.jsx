import React from 'react';
import PerformanceTable from './PerformanceTable.jsx';
import {TAX_COLUMNS} from './columns';

class Tax extends React.Component {
    render() {
        return(
            <PerformanceTable columns={TAX_COLUMNS}/>
        );
    }
}

export default Tax;