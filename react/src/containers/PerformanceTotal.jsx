import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getTotalPerformance } from '../selectors';
import styles from '../styles';
import { currency, percentage } from '../utils';

const localStyles = {
    total: {
        float: 'left',
        paddingLeft: '10px',
        paddingRight: '10px',
        borderRight: 'solid 1px',
    },
    number: {
        fontSize: '2em'
    }
};

class PerformanceTotal extends React.Component {
    static propTypes = {
        performance: PropTypes.object.isRequired
    }

    upOrDown(value) {
        if (value > 0) {
            return {
                style: styles.up,
                iconClass: 'glyphicon glyphicon-arrow-up'
            };
        } else if (value < 0) {
            return {
                style: styles.down,
                iconClass: 'glyphicon glyphicon-arrow-down'
            };
        }
        return {};
    }

    totalValue() {
        return (
            <div style={localStyles.total}>
                <p>Total Value</p>
                <p style={localStyles.number}>{currency(this.props.performance.mkt_value)}</p>
            </div>
        );
    }

    totalChange() {
        let gain = this.props.performance.gain;
        let gain_percent = this.props.performance.gain_percent;
        let style = Object.assign({}, this.upOrDown(gain).style, localStyles.number);
        return (
            <div style={localStyles.total}>
                <p>Total Change</p>
                <p style={style}>
                    {currency(gain)}{'  '}
                    <span className={this.upOrDown(gain).iconClass}></span>
                    {percentage(gain_percent)}
                </p>
            </div>
        );
    }

    todayChange() {
        let days_gain = this.props.performance.days_gain;
        let days_change_percent = this.props.performance.days_change_percent;
        let style = Object.assign({}, this.upOrDown(days_gain).style, localStyles.number);
        return (
            <div style={localStyles.total}>
                <p>Today's Change</p>
                <p style={style}>
                    {currency(days_gain)}{'  '}
                    <span className={this.upOrDown(days_gain).iconClass}></span>
                    {percentage(days_change_percent)}
                </p>
            </div>
        );
    }
    render() {
        return(
            <div>
                {this.totalValue()}
                {this.totalChange()}
                {this.todayChange()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    performance: getTotalPerformance(state)
});

export default connect(mapStateToProps)(PerformanceTotal);