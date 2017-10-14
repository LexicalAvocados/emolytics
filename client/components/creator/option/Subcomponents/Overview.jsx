import React from 'react';
import $ from 'jquery';
import Attention from './Attention.jsx';
import Demographics from './Demographics.jsx';
import Emotion from './Emotion.jsx';
import Feedback from './Feedback.jsx';

const Overview = (props) => {

  return (
    <div className='testerAnalyticsContainer'>

      <Demographics user={props.user} />

      <Emotion emotionsObj={props.emotionsObj} />
      <hr/>

      <div className="bottomPanelContainer">
        <Attention attention={props.attention}
                   timestampCallback={props.timestampCallback}/>

                 <Feedback likeStatus={true}
                  completionStatus={props.completionStatus} />
      </div>

    </div>
  )
}

export default Overview;
