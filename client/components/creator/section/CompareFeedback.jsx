import React from 'react';
import axios from 'axios';

// Separate component because we will want to display more information and style it easily
class CompareFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {



    }
    console.log(this);
  }

  render () {
    return (
    	<div className="optionDemographics">

        <h4> Feedback </h4>
        <div className="optionDemographicsBody">

          <h5> Completed Views: {this.props.demo.finished} </h5>
          <h5> Liked: {this.props.demo.liked} </h5>
          <h5> Percentage of Video Watched: {((this.props.emo.count/(this.props.option.length * this.props.demo.total))*100).toFixed(2)}% </h5>
          <h5> Attention Paid During Video: {((this.props.emo.sum/(this.props.option.length * this.props.demo.total))*100).toFixed(2)}% </h5>

        </div>

        

      </div>
    );
  }
}

export default CompareFeedback;