import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getTotalPerformance } from '../../selectors';
import styles from '../../styles';
import { currency, percentage } from '../../utils';
import NumberChangeTransition from '../Animation/NumberChangeTransition.jsx';

const Change = (props) => {
    const upOrDown = value => {
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
    };

    const {change, change_percent, title} = props;
    const numStyle = upOrDown(change).style;
    return (
        <div className="col-12 col-sm-6 col-md-auto mr-md-3">
            <div>{title}</div>
            <NumberChangeTransition upOrDown={change > 0}>
                <div className="d-inline-block">
                    <h2 style={numStyle}>
                        {currency(2)(change)}
                        {' '}
                        {change_percent !== undefined &&
                            <span className={upOrDown(change).iconClass}/>
                        }
                        {' '}
                        {change_percent !== undefined && percentage(change_percent)}
                    </h2>
                </div>
            </NumberChangeTransition>
        </div>
    );
};

Change.propTypes = {
    change: PropTypes.number.isRequired,
    change_percent: PropTypes.number,
    title: PropTypes.string.isRequired
};

const ExchangeRate = ({title, rate}) => (
    <div className="col-12 col-sm-6 col-md-auto mr-md-3">
        <div>{title}</div>
        <div className="d-inline-block">
            <h2>{rate}</h2>
        </div>
    </div>
)

ExchangeRate.propTypes = {
    title: PropTypes.string.isRequired,
    rate: PropTypes.string.isRequired
};

/*
 * Show change summary and exchange rate watch list
 */
class SummaryBar extends React.Component {
    static propTypes = {
        performance: PropTypes.object.isRequired,
        currencyRates: PropTypes.array.isRequired,
    }

    totalValue() {
        return (
            <div className="col-12 col-sm-6 col-md-auto mr-md-3">
                <span>Total Value</span>
                <h2>{currency(2)(this.props.performance.mkt_value)}</h2>
            </div>
        );
    }

    render() {
        const {performance, currencyRates} = this.props;
        //TODO hard coded exchange rate for now.
        // use watch list in future
        const exchangeWatchList = currencyRates.filter(rate => {
            return ['CADCNY', 'CADUSD', 'USDCAD'].includes(rate.id);
        });

        return(
            <div className="row no-gutters">
                {this.totalValue()}
                <Change change={performance.days_gain}
                    change_percent={performance.change_percent}
                    title="Today's Change"/>
                <Change change={performance.gain}
                    change_percent={performance.gain_percent}
                    title="Total Change"/>
                <Change change={performance.gain_overall}
                    change_percent={performance.gain_overall_percent}
                    title="Overall Change"/>
                {exchangeWatchList.map(rate => {
                    return (
                        <ExchangeRate title={rate.Name} rate={rate.Rate} key={rate.id}/>
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    performance: getTotalPerformance(state),
    currencyRates: state.currency.rate
});

export default connect(mapStateToProps)(SummaryBar);