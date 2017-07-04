// Suggested react-autosuggest in here
// https://forum.shakacode.com/t/whats-the-best-react-auto-complete-component/85
import Autosuggest from 'react-autosuggest';
import React from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../actions/symbols';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debounce from 'lodash.debounce';
import {escapeRegexCharacters} from '../../utils';

// Teach Autosuggest how to calculate suggestions for any given input value.
// Match name or symbol
const getMatchingSymbol = (value, symbols) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
        return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return symbols.filter(symbol => {
        return regex.test(symbol.name) || regex.test(symbol.symbol);
    });
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => {
    return suggestion.symbol + ' (' + suggestion.name + ')';
};

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div>
        {getSuggestionValue(suggestion)}
    </div>
);

class SymbolAutoComplete extends React.Component {
    constructor() {
        super();

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.
        this.state = {
            value: '',
            suggestions: []
        };
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    }

    onChange(event, { newValue, /*method*/ }) {
        this.setState({
            value: newValue
        });
    }

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested({ value }) {
        // TODO: Add logic to cancel previous request.
        // https://codepen.io/moroshko/pen/EPZpev
        const DEBOUNCE_TIMEOUT = 800;
        const debounceFn = debounce(() => {
            this.props.actions.fetchSymbols(value).then(symbols => {
                this.setState({
                    suggestions: getMatchingSymbol(value, symbols)
                });
            });
        }, DEBOUNCE_TIMEOUT);
        debounceFn(value);
    }

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    }

    onSuggestionSelected(event, data) {
        this.props.onSelected(data.suggestion);
    }

    render() {
        const { value, suggestions } = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: 'Type a stock symbol',
            className: 'form-control',
            value,
            onChange: this.onChange
        };

        // Finally, render it!
        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                onSuggestionSelected={this.onSuggestionSelected}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}

SymbolAutoComplete.propTypes = {
    onSelected: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({state});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SymbolAutoComplete);