import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getHoldingsPerformance } from '../../selectors';
import PieChart from '../../components/PieChart.jsx';

class CurrenAllocationWithDrilldown extends React.Component {

    static propTypes = {
        holdings: PropTypes.array.isRequired,
        balance: PropTypes.object.isRequired
    }

    render() {
        const { holdings, balance } = this.props;

        let data = holdings.filter(holding => holding.mkt_value > 0).map(holding => ({
            name: holding.symbol,
            y: holding.mkt_value,
            drilldown: null
        }));

        // Drill down Example
        // http://www.highcharts.com/demo/pie-drilldown
        let drillDownlabels = {};
        Object.keys(balance).forEach(symbol => {
            let label = balance[symbol].label;
            let holding = data.find(x => x.name === symbol);
            if (label && holding) {
                // create a object for the label for drill down array
                drillDownlabels[label] = drillDownlabels[label] || {
                    name: label,
                    id: label,
                    data: []
                };
                // push holding to drill down label's list
                drillDownlabels[label].data.push([symbol, holding.y]);
                // Remove holding from holding list.
                data = data.filter(x => x.name !== holding.name);

                // Add Label object to holding list
                let dataLabel = data.find(x => x.name === label);
                if (dataLabel) {
                    dataLabel.y += holding.y;
                } else {
                    data.push({
                        name: label,
                        y: holding.y,
                        drilldown: label
                    });
                }
            }
        });
        let drilldown = Object.keys(drillDownlabels).map(label => drillDownlabels[label]);

        // data and drilldown example
        // let data = [{
        //     name: "US Equity",
        //     y: 15,
        //     drilldown: "US Equity"
        // }, {
        //     name : "Canadian Equity",
        //     y: 30,
        //     drilldown: "Canadian Equity"
        // }];
        // let drilldown = [{
        //     name: "US Equity",
        //     id: "US Equity",
        //     data:[
        //         ["vti", 10],
        //         ["vfv", 5]
        //     ]
        // },{
        //     name: "Canadian Equity",
        //     id: "Canadian Equity",
        //     data:[
        //         ["vcn", 20],
        //         ["vsf", 10]
        //     ]
        // }];
        return (
            <PieChart
                data={data}
                container="current-allocation-with-drilldown"
                title="Current Allocation"
                subtitle="Set labels and click the slice to view details."
                drilldownArray={drilldown}
            />
        );
    }
}

const mapStateToProps = state => ({
    holdings: getHoldingsPerformance(state),
    balance: state.balance
});

export default connect(mapStateToProps)(CurrenAllocationWithDrilldown);