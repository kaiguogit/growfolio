import React from 'react';
import PropTypes from 'prop-types';

import Highcharts from 'highcharts';

class Chart extends React.Component {
    componentDidMount() {
        // Extend Highcharts with modules
        if (this.props.modules) {
            this.props.modules.forEach(function (module) {
                module(Highcharts);
            });
        }

        this.chart = new Highcharts[this.props.type || 'Chart'](
            this.props.container,
            this.props.options);
    }

    componentWillUnmount() {
        this.chart.destroy();
    }

    render() {
        return React.createElement('div', { id: this.props.container });
    }
}

Chart.propTypes = {
    type: PropTypes.string,
    container: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    modules: PropTypes.array
};

export default Chart;