import React from 'react';

const Feedback = (props) => {

  return (
    <div className="testerFeedback">
      <p> Watched {props.completionStatus}% of video</p>
      <p>Like: {props.likeStatus.toString()}</p>
      <p> Comments: </p>
    </div>
  )
};

export default Feedback;
