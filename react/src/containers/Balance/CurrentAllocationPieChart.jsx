import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { getHoldingsPerformance } from '../../selectors';
import PieChart from '../../components/PieChart.jsx';

class CurrentAllocationPieChart extends React.Component {

    static propTypes = {
        holdings: PropTypes.array.isRequired,
    }

    render() {
        const { holdings } = this.props;

        const data = holdings.map(holding => ({
            name: holding.symbol,
            y: holding.mkt_value
        }));

        return (
            <PieChart
                data={data}
                container="current-allocation"
                title="Current Allocation"
            />
        );
    }
}

const mapStateToProps = state => ({
    holdings: getHoldingsPerformance(state)
});

export default connect(mapStateToProps)(CurrentAllocationPieChart);