import React from 'react';
import axios from 'axios';
import c3 from 'c3';

// Separate component because we will want to display more information and style it easily
class CompareDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {


    }
    console.log(this);
  }

  componentWillReceiveProps(nProps) {

  }

  render () {
    return (
    	<div className="optionDemographics">

        <h4> Demographics </h4>

        <h5> Total Viewers: {this.props.data.total} </h5>
        <h5> Average Age: {this.props.data.age.toFixed(2)} </h5>
        <h5> Gender Distribution: {this.props.data.male}M/{this.props.data.total - this.props.data.male}F ({((this.props.data.male/this.props.data.total)*100).toFixed(2)}%/{(((this.props.data.total - this.props.data.male)/this.props.data.total)*100).toFixed(2)}%) </h5>

      </div>
    );
  }
}

export default CompareDemo;


{/* <Checkbox onChange={(e) => this.props.handleInvites(e, this.props.index)}>
Name: {this.props.tester.username} Age: {this.props.tester.age} Sex: {this.props.tester.sex} Race: {this.props.tester.race}
</Checkbox> */}