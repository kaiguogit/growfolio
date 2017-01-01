import React, {PropTypes} from 'react';
import Chart from './Chart.jsx';
import Highcharts from 'highcharts';
import isEqual from 'lodash.isequal';

class PieChart extends React.Component {

    static propTypes = {
        data: PropTypes.array.isRequired,
        container: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired
    }

    shouldComponentUpdate(nextProps) {
        // only update the chart when data is changed.
        // The actual change rely on the key passed to Chart.
        return !isEqual(nextProps.data, this.props.data);
    }

    render() {
        const { data, container, title } = this.props;
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
                data: data
            }]
        };
        return (
            <Chart
                key={JSON.stringify(data)}
                container={container}
                options={options}
            />
        );
    }
}

export default PieChart;