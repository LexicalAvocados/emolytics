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
        <div>
          <Col xs={5}>
            <div className="optionContainer">
              <Demographics demographic={props.demographic} user={props.user} selectedUsers={props.selectedUsers} allUsers={props.allUsers}/>
            </div>
            <div className="optionContainer">
              <Attention optionEmotionObj={props.optionEmotionObj} attention={props.attention} timestampCallback={props.timestampCallback}/>
            </div>
            <br/>
            <div className="optionContainer">
              <Feedback demographic={props.demographic} optionEmotionObj={props.optionEmotionObj} likeRatio={props.likeRatio} completionStatus={props.completionStatus}/> 
            </div>


          </Col>

          <Col xs={7}>
            <div className="optionContainer">
              <Emotion optionEmotionObj={props.optionEmotionObj} emotionsObj={props.emotionsObj} />
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

export default Overview;
