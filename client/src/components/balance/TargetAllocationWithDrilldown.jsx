import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import PieChart from '../../components/PieChart.jsx';

class TargetAllocationWithDrilldown extends React.Component {
    render() {
        const { balance } = this.props;

        // Drill down Example
        // http://www.highcharts.com/demo/pie-drilldown
        let slices = [];
        let drillDownlabels = {};
        Object.keys(balance).forEach(symbol => {
            let label = balance[symbol].label;

            if (label) {
                // create a object for the label for drill down array
                drillDownlabels[label] = drillDownlabels[label] || {
                    name: label,
                    id: label,
                    data: []
                };
                // push holding to drill down label's list
                drillDownlabels[label].data.push([symbol, balance[symbol].percentage]);

                // Add Label object to slices list
                let slice = slices.find(x => x.name === label);
                if (slice) {
                    slice.y += balance[symbol].percentage;
                } else {
                    slices.push({
                        name: label,
                        y: balance[symbol].percentage,
                        drilldown: label
                    });
                }
            } else {
                slices.push({
                    name: symbol,
                    y: balance[symbol].percentage,
                    drilldown: null});
            }
        });
        let drilldown = Object.keys(drillDownlabels).map(label => drillDownlabels[label]);

        return (
            <PieChart
                data={slices}
                container="target-allocation"
                title="Target Allocation"
                subtitle="Set labels and click the slice to view details."
                drilldownArray={drilldown}
            />
        );
    }
}

TargetAllocationWithDrilldown.propTypes = {
    balance: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    balance: state.balance
});

export default connect(mapStateToProps)(TargetAllocationWithDrilldown);