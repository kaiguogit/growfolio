import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { getBalanceArray } from '../../selectors';
import PieChart from '../../components/PieChart.jsx';

class TargetAllocationPieChart extends React.Component {

    static propTypes = {
        data: PropTypes.array.isRequired,
    }

    render() {
        const { data } = this.props;

        return (
            <PieChart
                data={data}
                container="target-allocation"
                title="Target Allocation"
            />
        );
    }
}

const mapStateToProps = state => ({
    data: getBalanceArray(state)
});

export default connect(mapStateToProps)(TargetAllocationPieChart);