// Suggested react-autosuggest in here
// https://forum.shakacode.com/t/whats-the-best-react-auto-complete-component/85
import Autosuggest from 'react-autosuggest';
import React from 'react';
import PropTypes from 'prop-types';
import * as actions from '../../actions/symbols';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debounce from 'lodash/debounce';
import {escapeRegexCharacters} from '../../utils';
import IsolatedScroll from 'react-isolated-scroll';
import {getHoldings} from '../../selectors';

// Teach Autosuggest how to calculate suggestions for any given input value.
// Match name or symbol
// DEPRECATED yahoo finance is not working.
// const getMatchingSymbol = (value, symbols) => {
//     const escapedValue = escapeRegexCharacters(value.trim());

//     if (escapedValue === '') {
//         return [];
//     }

//     const regex = new RegExp('^' + escapedValue, 'i');

//     return (symbols || []).filter(symbol => {
//         return regex.test(symbol.$symbol);
//     });
// };
const getMatchingSymbol = (value, holdings) => {
    return holdings.filter(holding => {
        if (value) {
            return holding.symbol.toLowerCase().indexOf(value.toLowerCase()) >= 0;
        }
    });
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.symbol;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div>
        {`${suggestion.symbol}: ${suggestion.name}`}
    </div>
);

// How do I limit the scrolling of the suggestions container to the container itself?
// https://github.com/moroshko/react-autosuggest/blob/master/FAQ.md#how-do-i-limit-the-scrolling-of-the-suggestions-container-to-the-container-itself
const renderSuggestionsContainer = ({ containerProps, children }) => {
  const { ref, ...restContainerProps } = containerProps;
  const callRef = isolatedScroll => {
    if (isolatedScroll !== null) {
      ref(isolatedScroll.component);
    }
  };

  return (
    <IsolatedScroll ref={callRef} {...restContainerProps}>
      {children}
    </IsolatedScroll>
  );
};

class SymbolAutoComplete extends React.Component {
    constructor(props) {
        super(props);

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.
        this.state = {
            value: props.data ? getSuggestionValue(props.data) : '',
            suggestions: []
        };
        this.onChange = this.onChange.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
        // https://codepen.io/moroshko/pen/EPZpev
        const DEBOUNCE_TIMEOUT = 800;
        this.debouncedLoadSuggestions = debounce(this.loadSuggestions, DEBOUNCE_TIMEOUT);
    }

    onChange(event, { newValue, /*method*/ }) {
        this.props.onChange(newValue);
        this.setState({
            value: newValue
        });
    }

    loadSuggestions(value) {
        // this.props.actions.fetchSymbols(value).then(symbols => {
        //     if (Array.isArray(symbols) && symbols.length) {
        //         this.setState({
        //             suggestions: getMatchingSymbol(value, symbols)
        //         });
        //     }
        // });
        this.setState({
            suggestions: getMatchingSymbol(value, this.props.holdings)
        });
    }
    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested({ value }) {
        // TODO: Add logic to cancel previous request.
        this.debouncedLoadSuggestions(value);
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
                renderSuggestionsContainer={renderSuggestionsContainer}
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
    // Data is used as default value of input.
    data: PropTypes.object,
    onSelected: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired,
    holdings: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    holdings: getHoldings(state)
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SymbolAutoComplete);