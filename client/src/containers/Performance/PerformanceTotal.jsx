import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getTotalPerformance } from '../../selectors';
import styles from '../../styles';
import { currency, percentage } from '../../utils';
import NumberChangeTransition from '../../components/Animation/NumberChangeTransition.jsx';

class Change extends React.Component {
    static propTypes = {
        change: PropTypes.number.isRequired,
        change_percent: PropTypes.number,
        title: PropTypes.string.isRequired
    }

    upOrDown(value) {
        if (value > 0) {
            return {
                style: styles.up,
                iconClass: 'fa fa-long-arrow-up'
            };
        } else if (value < 0) {
            return {
                style: styles.down,
                iconClass: 'fa fa-long-arrow-down'
            };
        }
        return {};
    }

    render() {
        const {change, change_percent, title} = this.props;
        const numStyle = this.upOrDown(change).style;
        return (
            <div className="col-12 col-sm-6 col-md" key={`${title}-${change}`}>
                <div>{title}</div>
                <NumberChangeTransition upOrDown={change > 0}>
                    <div className="d-inline-block">
                        <h2 style={numStyle}>
                            {currency(change)}
                            {' '}
                            {change_percent !== undefined &&
                                <span className={this.upOrDown(change).iconClass}/>
                            }
                            {' '}
                            {change_percent !== undefined && percentage(change_percent)}
                        </h2>
                    </div>
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
            <div className="col-12 col-sm-6 col-md">
                <span>Total Value</span>
                <h2>{currency(this.props.performance.mkt_value)}</h2>
            </div>
        );
    }

    render() {
        return(
            <div className="row no-gutters">
                {this.totalValue()}
                <Change change={this.props.performance.days_gain}
                    change_percent={this.props.performance.change_percent}
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