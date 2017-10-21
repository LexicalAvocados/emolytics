import React from 'react';
import {Link} from 'react-router-dom';
import { Button } from 'react-bootstrap';
import axios from 'axios';

class OptionListEntryData extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
    };
    console.log(this.props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="sectionOptionData">
        <h4> Data </h4>
        {this.props.data ? (
        <div>
          <p> People Who Watched: {this.props.data.total} </p>
          <p> People Who Finished: {this.props.data.finished} </p>
          <p> People Who Liked: {this.props.data.liked} </p>
        </div>

        ) : (

        <p> </p>
        )}


      </div>
    );
  }
}

        // <p> People Who Watched: {this.props.data.total} </p>
        // <p> People Who Finished: {this.props.data.finished} </p>
        // <p> People Who Liked: {this.props.data.liked} </p>

export default OptionListEntryData;
