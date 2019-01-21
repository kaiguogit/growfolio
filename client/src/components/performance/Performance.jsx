import React from 'react';
import PerformanceTable from './PerformanceTable.jsx';
import {PERFORMANCE_COLUMNS} from './columns';

class Performance extends React.Component {
    render() {
        return(
            <PerformanceTable columns={PERFORMANCE_COLUMNS}/>
        );
    }
}

export default Performance;