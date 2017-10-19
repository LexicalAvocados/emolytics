import React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';


class OptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      date: ''
    }
  }

  render() {
    return (
      <div className="currentSectionOptionListEntry">
        <div onClick={() => this.props.onOptionClick(this.props.index)}>
          <img src={this.props.option.thumbnail} alt=""/>
          <p className="closerText">{this.props.option.name}</p>
        <p>Created On: {this.state.date = new Date(this.props.option.createdAt.slice(0, 19)).toString().slice(0, 24)}</p>
        </div>
      </div>
    );
  }
}

export default OptionList;
