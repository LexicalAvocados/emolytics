import React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';

class OptionListEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    axios.get('/api/getTestersForOption', { params: { optionId: this.props.option.id }})
      .then((testerIds) => {
        this.props.concatTesters(testerIds.data, this.props.index);
      })
      .catch((err) => {
        console.log('Error retrieving testers for option', err);
      });
  }

  render() {
    return (
      <div className="currentSectionOptionListEntry">
        <div onClick={() => this.props.onOptionClick(this.props.index)}>
          <img src={this.props.option.thumbnail} alt=""/>
          <p className="closerText">{this.props.option.name}</p>
        </div>
      </div>
    );
  }
}

export default OptionListEntry;
