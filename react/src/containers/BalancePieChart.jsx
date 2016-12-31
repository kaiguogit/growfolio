import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { getHoldingsPerformance } from '../selectors';
import Chart from '../components/Chart.jsx';
import Highcharts from 'highcharts';
import isEqual from 'lodash.isequal';

class BalancePieChart extends React.Component {

    static propTypes = {
        holdings: PropTypes.array.isRequired,
        lastUpdated: PropTypes.number.isRequired,
        container: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    }

    shouldComponentUpdate(nextProps) {
        return !isEqual(nextProps.holdings, this.props.holdings);
    }

    render() {
        const { holdings, lastUpdated, container, title } = this.props;
        const options = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: title
            },
            tooltip: {
                pointFormant: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Holdings',
                colorByPoint: true,
                data: holdings.map(holding => {
                    // console.log("holding is ", holding);
                    return {
                    name: holding.symbol,
                    y: holding.mkt_value
                    };
                })
            }]
        };
        return (
            <Chart
                key={lastUpdated}
                container={container}
                options={options}
            />
        );
    }
}

const mapStateToProps = state => ({
    holdings: getHoldingsPerformance(state),
    lastUpdated: state.quotes.lastUpdated
});

export default connect(mapStateToProps)(BalancePieChart);