import React from 'react';
import axios from 'axios';
import CompareDemo from './CompareDemo.jsx';
import CompareEmotion from './CompareEmotion.jsx';
import CompareFeedback from './CompareFeedback.jsx';

// Separate component because we will want to display more information and style it easily
class CompareCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      demographics: {
        total: 0,
        liked: 0,
        finished: 0,
        age: 0,
        male: 0
      },
      emotions: {
        count: 0,
        anger: 0,
        contempt: 0,
        disgust: 0,
        fear: 0,
        happiness: 0,
        neutral: 0,
        sadness: 0,
        surprise: 0,
        sum: 0
      }

    }
    console.log(this);
  }

  componentWillMount() {
      axios.post('/api/option/getDemographics', this.props.option)
        .then(data => {
          console.log(data);
          this.setState({
            demographics: data.data
          }, () => {
            console.log(this);
          })
        })
      axios.post('/api/option/getEmotion', this.props.option)
        .then(data => {
          console.log('EMOTION', data);
          this.setState({
            emotions: data.data[0]
          })
        })
  }

  render () {
    return (
    	<div className="sectionCompareCharts">

      <div className="optionContainer">
        <CompareDemo data={this.state.demographics}/>
      </div>
      <br/>
      <br/>
      <div className="optionContainer">
        <CompareFeedback option={this.props.option} demo={this.state.demographics} emo={this.state.emotions}/>
      </div>
      <br/>
      <br/>
      <div className="optionContainer">
        <CompareEmotion idx={this.props.idx} data={this.state.emotions}/>
      </div>



      </div>
    );
  }
}

export default CompareCharts;


{/* <Checkbox onChange={(e) => this.props.handleInvites(e, this.props.index)}>
Name: {this.props.tester.username} Age: {this.props.tester.age} Sex: {this.props.tester.sex} Race: {this.props.tester.race}
</Checkbox> */}