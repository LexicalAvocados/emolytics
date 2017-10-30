import React from 'react';
import $ from 'jquery';
import Attention from './Attention.jsx';
import Demographics from './Demographics.jsx';
import Emotion from './Emotion.jsx';
import Feedback from './Feedback.jsx';
import { Col } from 'react-bootstrap';

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }

  }

  componentDidMount() {
    // this.props.generateCharts();
  }




  render() {
    return (
      <div className='testerAnalyticsContainer'>
        <div>
          <div>
            <Col xs={5}>
              <div className="optionContainer">
                <Demographics demographic={this.props.demographic} user={this.props.user} selectedUsers={this.props.selectedUsers} allUsers={this.props.allUsers}/>
              </div>
              <div className="optionContainer">
                <Attention optionEmotionObj={this.props.optionEmotionObj} attention={this.props.attention} timestampCallback={this.props.timestampCallback}/>
              </div>
              <br/>
              <div className="optionContainer">
                <Feedback demographic={this.props.demographic} optionEmotionObj={this.props.optionEmotionObj} /> 
              </div>
            </Col>
            <Col xs={7}>
              <div className="optionContainer">
                <Emotion optionEmotionObj={this.props.optionEmotionObj} emotionsObj={this.props.emotionsObj} />
              </div>
              <br/>
            </Col>
          </div>
          <div>
            <Col xs={6}>
            </Col>
            <Col xs={6}>
            </Col>
          </div>
          <br/>
        </div>
      </div>
    )
  }



}




export default Overview;
