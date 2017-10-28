import React from 'react';
import $ from 'jquery';
import Attention from './Attention.jsx';
import Demographics from './Demographics.jsx';
import Emotion from './Emotion.jsx';
import Feedback from './Feedback.jsx';
import { Col } from 'react-bootstrap';

const Overview = (props) => {

  return (
    <div className='testerAnalyticsContainer'>
      <div>
        <Col xs={5}>
          <div className="optionContainer">
            <Demographics demographic={props.demographic} user={props.user} selectedUsers={props.selectedUsers} allUsers={props.allUsers}/>
          </div>
          <div className="optionContainer">
            <div className="optionBottom">
              <Feedback likeRatio={props.likeRatio} completionStatus={props.completionStatus} />
              <Attention optionEmotionObj={props.optionEmotionObj} attention={props.attention} timestampCallback={props.timestampCallback}/>
            </div>
          </div>
        </Col>

        <Col xs={7}>
          <div className="optionContainer">
            <Emotion optionEmotionObj={props.optionEmotionObj} emotionsObj={props.emotionsObj} />
          </div>
        </Col>
        <br/>


      </div>



    </div>
  )
}

export default Overview;
