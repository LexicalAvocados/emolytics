import React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';

class OptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      date: ''
    }
<<<<<<< HEAD
  }

  componentDidMount() {
    axios.get('/api/getTestersForOption', { params: { optionId: this.props.option.id }})
      .then((testerIds) => {
        this.props.concatTesters(testerIds.data, this.props.index);
      })
      .catch((err) => {
        console.log('Error retrieving testers for option', err);
      });
=======
>>>>>>> feature
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
