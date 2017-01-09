import React from 'react';
// import CurrentAllocationPieChart from './CurrentAllocationPieChart.jsx';
import TargetAllocationWithDrilldown from '../../containers/Balance/TargetAllocationWithDrilldown.jsx';
import CurrenAllocationWithDrilldown from '../../containers/Balance/CurrenAllocationWithDrilldown.jsx';
import BalanceForm from '../../containers/Balance/BalanceForm.jsx';
import { Row, Col } from 'react-bootstrap';

class Balance extends React.Component {


    render() {
        return (
            <div>
                <Row>
                    <Col md={6}>
                                <CurrenAllocationWithDrilldown/>
                    </Col>
                    <Col md={6}>
                                <TargetAllocationWithDrilldown/>
                    </Col>
                </Row>
                <Row>
                    <BalanceForm/>
                </Row>
            </div>
        );
    }
}

export default Balance;