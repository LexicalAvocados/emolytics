import React from 'react';
import {Link} from 'react-router-dom';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';


class OptionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      testers: []
    };
    this.grabTesters = this.grabTesters.bind(this);
  }

  grabTesters() {
    axios.get('/api/getTesters')
      .then((response) => {
        this.setState({
          testers: response.data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="currentSectionOptionListEntry">
        <Link to={'/option' + this.props.option.id}>
          <img src={this.props.option.thumbnail} alt="" onClick={() => this.props.onOptionClick(this.props.index)}/>
        </Link>
        <DropdownButton onClick={this.grabTesters} id="dropdown-btn-menu" title="Invite testers">
          {this.state.testers.map((tester, i) => (
            <MenuItem key={i}>Name: {tester.username} Age: {tester.age} Sex: {tester.sex}</MenuItem>
          ))}
        </DropdownButton>
          
      </div>
    );
  }
}

export default OptionList;