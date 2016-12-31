import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { getHoldingsPerformance } from '../selectors';
import BalancePieChart from './BalancePieChart.jsx';

class Balance extends React.Component {
    static propTypes = {
        holdings: PropTypes.array.isRequired,
    }

    render() {
        return (
            <BalancePieChart/>
        );
    }
}

const mapStateToProps = state => ({
    holdings: getHoldingsPerformance(state),
});

export default connect(mapStateToProps)(Balance);