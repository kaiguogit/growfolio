import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions';

const style = {
    display: 'inline-block'
};

class CurrencySelector extends React.Component {
    static propTypes = {
        displayCurrency: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired
    }

    handleSelectCurrency = e => {
        this.props.actions.selectDisplayCurrency(e.target.value);
    }

    render() {
        return (
            <div style={style}>
                <label htmlFor="display-currency">Display Currency</label>
                <select className="form-control" id="display-currency" value={this.props.displayCurrency} onChange={this.handleSelectCurrency}>
                    <option value="CAD">CAD</option>
                    <option value="USD">USD</option>
                </select>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    displayCurrency: state.portfolio.displayCurrency
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrencySelector);