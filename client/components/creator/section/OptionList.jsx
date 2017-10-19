import React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';


class OptionList extends React.Component {
  constructor(props) {
    super(props);
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

export default OptionList;
