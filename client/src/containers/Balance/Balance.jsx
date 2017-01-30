import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as quotesActions from '../../actions/quotes';
import isEqual from 'lodash.isequal';
import { getHoldings } from '../../selectors';

// import CurrentAllocationPieChart from './CurrentAllocationPieChart.jsx';
import TargetAllocationWithDrilldown from './TargetAllocationWithDrilldown.jsx';
import CurrenAllocationWithDrilldown from './CurrenAllocationWithDrilldown.jsx';
import BalanceForm from './BalanceForm.jsx';
import { Row, Col } from 'react-bootstrap';

class Balance extends Component {
    static propTypes = {
        holdings: PropTypes.array.isRequired,
        actions: PropTypes.object.isRequired,
        displayCurrency: PropTypes.string.isRequired
    }

    componentDidMount() {
        this.props.actions.setIntervalRefreshQuotes();
    }

    componentDidUpdate(prevProps) {
        //Only refresh quotes when holdings or display currency changed
        if (!(isEqual(prevProps.holdings, this.props.holdings) &&
            prevProps.displayCurrency === this.props.displayCurrency)) {
            this.props.actions.refreshQuotes();
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col md={6}>
                                <CurrenAllocationWithDrilldown/>
                    </Col>
                    <Col md={6}>
                                <TargetAllocationWithDrilldown/>
                    </Col>
                </Row>
                <Row>
                    <BalanceForm/>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        holdings: getHoldings(state),
        displayCurrency: state.portfolio.displayCurrency
    };
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(quotesActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Balance);