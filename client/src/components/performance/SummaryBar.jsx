import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTotalPerformance } from '../../selectors';
import styles from '../../styles';
import { currency, percentage, round} from '../../utils';
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

    const {change, changePercent, title} = props;
    const numStyle = upOrDown(change).style;
    return (
        <div className="col-12 col-sm-6 col-md-auto mr-md-3">
            <div>{title}</div>
            <NumberChangeTransition data={change}>
                <div className="d-inline-block">
                    <h2 style={numStyle}>
                        {currency(2)(change)}
                        {' '}
                        {changePercent !== undefined &&
                            <span className={upOrDown(change).iconClass}/>
                        }
                        {' '}
                        {changePercent !== undefined && percentage(changePercent)}
                    </h2>
                </div>
            </NumberChangeTransition>
        </div>
    );
};

Change.propTypes = {
    change: PropTypes.number,
    changePercent: PropTypes.number,
    title: PropTypes.string.isRequired
};

const ExchangeRate = ({title, rate}) => (
    <div className="col-3 col-sm-1 col-md-auto mr-4">
        <div>{title}</div>
        <div className="d-inline-block">
            <h2>{round(rate, 3)}</h2>
        </div>
    </div>
);

ExchangeRate.propTypes = {
    title: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired
};

/*
 * Show change summary and exchange rate watch list
 */
class SummaryBar extends React.Component {
    constructor(props) {
        super(props);
        this.totalValue = this.totalValue.bind(this);
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
        const exchangeWatchList = (currencyRates || []).filter(rate => {
            return ['CADCNY', 'CADUSD', 'USDCAD'].includes(rate.id);
        });

        return(
            <div className="summary-bar row no-gutters">
                {this.totalValue()}
                <Change change={performance.daysGain}
                    changePercent={performance.changePercent}
                    title="Today's Change"/>
                <Change change={performance.gain}
                    changePercent={performance.gainPercent}
                    title="Total Change"/>
                <Change change={performance.gainOverall}
                    changePercent={performance.gainOverallPercent}
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

SummaryBar.propTypes = {
    performance: PropTypes.object.isRequired,
    currencyRates: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    performance: getTotalPerformance(state),
    currencyRates: state.currency.rate
});

export default connect(mapStateToProps)(SummaryBar);