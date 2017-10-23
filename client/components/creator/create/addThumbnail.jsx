import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ChangeActions from '../../../actions';

class ThumbnailListInAddOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      url: '',
      thumbnail:''
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    var name = e.target.name;
    var val = e.target.value;
    this.setState({
      [name]: val
    });
  }

  render() {
    return (
      <div className="ThumbnailListInAddOption">
        {this.handleChange}
      </div>
    );
  }


}