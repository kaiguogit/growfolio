import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { getHoldingsPerformance } from '../../selectors';
// import CurrentAllocationPieChart from './CurrentAllocationPieChart.jsx';
import TargetAllocationWithDrilldown from './TargetAllocationWithDrilldown.jsx';
import CurrenAllocationWithDrilldown from './CurrenAllocationWithDrilldown.jsx';
import BalanceForm from './BalanceForm.jsx';
import { Row, Col } from 'react-bootstrap';

class Balance extends React.Component {
    static propTypes = {
        holdings: PropTypes.array.isRequired,
    }

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

const mapStateToProps = state => ({
    holdings: getHoldingsPerformance(state),
});

export default connect(mapStateToProps)(Balance);