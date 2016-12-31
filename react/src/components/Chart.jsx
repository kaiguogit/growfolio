import React, {PropTypes} from 'react';
import Highcharts from 'highcharts';

class Chart extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        container: PropTypes.string.isRequired,
        options: PropTypes.object.isRequired
    }

    componentDidMount() {
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

export default Chart;