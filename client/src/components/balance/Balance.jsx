import React from 'react';
// import CurrentAllocationPieChart from './CurrentAllocationPieChart.jsx';
import TargetAllocationWithDrilldown from './TargetAllocationWithDrilldown.jsx';
import CurrenAllocationWithDrilldown from './CurrenAllocationWithDrilldown.jsx';
import BalanceForm from './BalanceForm.jsx';

class Balance extends React.Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <CurrenAllocationWithDrilldown/>
                    </div>
                    <div className="col-md-6">
                        <TargetAllocationWithDrilldown/>
                    </div>
                </div>
                <div className="row">
                    <BalanceForm/>
                </div>
            </div>
        );
    }
}

export default Balance;