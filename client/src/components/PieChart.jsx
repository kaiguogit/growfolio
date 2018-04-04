import React from 'react';
import PropTypes from 'prop-types';

import Chart from './Chart.jsx';
import drilldown from 'highcharts/modules/drilldown';
import {isEqual} from 'lodash';

class PieChart extends React.Component {
    shouldComponentUpdate(nextProps) {
        // only update the chart when data is changed.
        // The actual change rely on the key passed to Chart.
        return !isEqual(nextProps.data, this.props.data);
    }

    render() {
        const { data, container, title, drilldownArray, subtitle } = this.props;
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
            subtitle: {
                text: subtitle
            },
            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                // pointFormant: '{series.name}: <b>{point.percentage:.1f}%</b>'
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.percentage:.2f}%</b> of total<br/>\
                              Value: {point.y:.2f}'
            },
            plotOptions: {
                // pie: {
                //     allowPointSelect: true,
                //     cursor: 'pointer',
                //     dataLabels: {
                //         enabled: true,
                //         format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                //         style: {
                //             color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                //         }
                //     }
                // },
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.percentage:.1f}%'
                    }
                }
            },
            series: [{
                name: 'Holdings',
                colorByPoint: true,
                data: data
            }],
            drilldown: {
                series: drilldownArray
            }
        };
        return (
            <Chart
                key={JSON.stringify(data)}
                container={container}
                options={options}
                modules={[drilldown]}
            />
        );
    }
}

PieChart.propTypes = {
    data: PropTypes.array.isRequired,
    container: PropTypes.string.isRequired,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    drilldownArray: PropTypes.array
};

export default PieChart;