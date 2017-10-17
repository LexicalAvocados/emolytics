import React from 'react';

const Feedback = (props) => {

  return (
    <div className="testerFeedback">
      <p> Watched {props.completionStatus}% of video</p>
      <p>Like: {props.likeRatio}</p>
      <p> Comments: </p>
    </div>
  )
};

export default Feedback;
