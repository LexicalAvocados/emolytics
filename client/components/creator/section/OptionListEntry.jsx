import React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';

class OptionListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      date: ''
    };
    console.log(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
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
      <div onClick={() => this.props.onOptionClick(this.props.index)} className="currentSectionOptionListEntry">
        <p className="closerText">Option Name: {this.props.option.name}</p>
        <p className="closerText">Option Description: {this.props.option.description}</p>
        <p>Created On: {this.state.date = new Date(this.props.option.createdAt.slice(0, 19)).toString().slice(0, 24)}</p>
          <img src={this.props.option.thumbnail} alt=""/>
      </div>
    );
  }
}

export default OptionListEntry;
