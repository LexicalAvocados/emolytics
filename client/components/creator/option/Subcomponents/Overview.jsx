import React from 'react';
import $ from 'jquery';
import Attention from './Attention.jsx';
import Demographics from './Demographics.jsx';
import Emotion from './Emotion.jsx';
import Feedback from './Feedback.jsx';

const Overview = (props) => {

  return (
    <div className='testerAnalyticsContainer'>
      <div className="optionContainer">
        <Demographics user={props.user} selectedUsers={props.selectedUsers} allUsers={props.allUsers}/>
      </div>

      <div className="optionContainer">
        <Emotion emotionsObj={props.emotionsObj} />
      </div>
      <br/>

      <div className="optionContainer">
        <div className="optionBottom">
          <Feedback likeRatio={props.likeRatio} completionStatus={props.completionStatus} />
          <Attention attention={props.attention} timestampCallback={props.timestampCallback}/>
        </div>
      </div>

    </div>
  )
}

export default Overview;
