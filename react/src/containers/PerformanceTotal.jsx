import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getHoldingsPerformance } from '../selectors';
import styles from '../styles';
import { percentage } from '../utils';

const localStyles = {
    total: {
        float: 'left',
        marginRight: '10px'
    },
    number: {
        fontSize: '2em'
    }
};

class PerformanceTotal extends React.Component {
    static propTypes = {
        holdings: PropTypes.array.isRequired
    }

    coloredCell(value) {
        if (value > 0) {
            return styles.up;
        } else if (value < 0) {
            return styles.down;
        }
        return {};
    }

    totalValue() {
        let value = this.props.holdings.reduce((acc, holding) =>
            acc + holding.mkt_value, 0);
        return (
            <p style={localStyles.number}>{value}</p>
        );
    }

    todayChange() {
        let day_gain = this.props.holdings.reduce((acc, holding) =>
            acc + holding.days_gain, 0);
        let change_percent = this.props.holdings.reduce((acc, holding) =>
            acc + holding.change_percent, 0);
        let style = Object.assign({}, this.coloredCell(day_gain), localStyles.number);
        return (
            <p style={style}>{day_gain}{' '}{percentage(change_percent)}</p>
        );
    }
    render() {
        return(
            <div>
                <div style={localStyles.total}>
                    <p>Total Value</p>
                    {this.totalValue()}
                </div>
                <div style={localStyles.total}>
                    <p>Today's Change</p>
                    {this.todayChange()}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    holdings: getHoldingsPerformance(state)
});

export default connect(mapStateToProps)(PerformanceTotal);