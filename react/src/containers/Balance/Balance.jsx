import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { getHoldingsPerformance } from '../../selectors';
import CurrentAllocationPieChart from './CurrentAllocationPieChart.jsx';
import TargetAllocationPieChart from './TargetAllocationPieChart.jsx';
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
                                <CurrentAllocationPieChart/>
                    </Col>
                    <Col md={6}>
                                <TargetAllocationPieChart/>
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