import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { getHoldingsPerformance } from '../selectors';
import BalancePieChart from './BalancePieChart.jsx';
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
                                <BalancePieChart container="1" title="Current Allocation"/>
                    </Col>
                    <Col md={6}>
                                <BalancePieChart container="2" title="Target Allocation"/>
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