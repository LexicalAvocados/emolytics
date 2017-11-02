import React from 'react';
import Autosuggest from 'react-autosuggest';

class SearchAutosuggest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: []
    };
    this.getSuggestions = this.getSuggestions.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
  }

  getSuggestionValue(suggestion) {
    return suggestion.name
  };

  renderSuggestion(suggestion){
    return (
      <div onClick={() => this.props.filterResultsBasedOnSelecion(suggestion.name)} style={autosuggestStyle}>
        <a onClick={() => this.props.filterResultsBasedOnSelecion(suggestion.name)} style={black}>{suggestion.name}</a>
      </div>
    )
  };

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.props.options.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  onChange(event, { newValue, reason }){
    this.setState({
      value: newValue
    }, () => {
      if (this.state.value === '') this.props.filterResultsBasedOnSelecion('')
    });
  };

  onSuggestionsFetchRequested({ value }){
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search for videos',
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        style={autosuggestStyle}
      />
    );
  }
};

const autosuggestStyle = {
  zIndex: '1001'
}

const black = {
  color: 'black'
}

export default SearchAutosuggest;
