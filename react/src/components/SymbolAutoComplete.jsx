import React, { PropTypes } from 'react';
import Select from 'react-select';
import * as actions from '../actions/symbols';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class SymbolAutoComplete extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        actions: PropTypes.object.isRequired
    }

    renderValue = option => {
        return <div>{`${option.exch}:${option.value}`}</div>;
    }

    selectSymbolSearch = input => {
        return this.props.actions.fetchSymbols(input).then(data=>{
            let result = {};
            result = {
                options: data.map(symbol => {
                    // xch: "NYQ"
                    // exchDisp: "NYSE"
                    // name: "Alleghany Corporation"
                    // symbol: "Y"
                    return {
                        //Remove symbol suffix, e.g ZPR.TO -> ZPR
                        value: symbol.symbol.replace(/\..*/, ''),
                        label: `${symbol.symbol}     ${symbol.name}       ${symbol.exchDisp}`,
                        exch: symbol.exchDisp,
                        name: symbol.name
                    };
                })
            };
            return result;
        });
    }

    render() {
        return(
            <Select.Async
                value={this.props.value}
                onChange={this.props.onChange}
                loadOptions={this.selectSymbolSearch}
                valueRenderer={this.renderValue}
            />
        );
    }
}

const mapStateToProps = state => ({state});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SymbolAutoComplete);