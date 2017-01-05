import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getTotalPerformance } from '../selectors';
import styles from '../styles';
import { currency, percentage } from '../utils';
import NumberChangeTransition from '../components/Animation/NumberChangeTransition.jsx';

const localStyles = {
    total: {
        display: 'inline-block',
        paddingLeft: '10px',
        paddingRight: '10px'
    },
    number: {
        fontSize: '2em'
    }
};

class Change extends React.Component {
    static propTypes = {
        change: PropTypes.number.isRequired,
        change_percent: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired
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

    render() {
        const {change, change_percent, title} = this.props;
        const numStyle = Object.assign({}, this.upOrDown(change).style, localStyles.number);
        return (
            <div style={localStyles.total} key={`${title}-${change}`}>
                <p>{title}</p>
                <NumberChangeTransition upOrDown={change > 0}>
                    <p style={numStyle}>
                        {currency(change)}{'  '}
                        <span className={this.upOrDown(change).iconClass}></span>
                        {percentage(change_percent)}
                    </p>
                </NumberChangeTransition>
            </div>
        );
    }
}

class PerformanceTotal extends React.Component {
    static propTypes = {
        performance: PropTypes.object.isRequired
    }

    totalValue() {
        return (
            <div style={localStyles.total}>
                <p>Total Value</p>
                <p style={localStyles.number}>{currency(this.props.performance.mkt_value)}</p>
            </div>
        );
    }

    render() {
        return(
            <div>
                {this.totalValue()}
                <Change change={this.props.performance.days_gain}
                    change_percent={this.props.performance.days_change_percent}
                    title="Today's Change"/>
                <Change change={this.props.performance.gain}
                    change_percent={this.props.performance.gain_percent}
                    title="Total Change"/>
                <Change change={this.props.performance.gain_overall}
                    change_percent={this.props.performance.gain_overall_percent}
                    title="Overall Change"/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    performance: getTotalPerformance(state)
});

export default connect(mapStateToProps)(PerformanceTotal);