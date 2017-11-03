import React from 'react';

const Feedback = (props) => {

  console.log('FEEDBACK', props);

  const completion = () => {
    let total = props.demographic.total * props.optionEmotionObj.count.length;
    let watched = props.optionEmotionObj.count.reduce((sum, curr) => {
      return sum + parseInt(curr);
    }, 0)
    // console.log('WATCHED', watched, total);
    return (watched/total);
  }

  return (
    <div className="testerFeedback">
      <div className="testerFeedbackHeading">
        <div className="optionTitle">
          <h4> <small> Feedback </small> </h4>
        </div>
        <hr/>
      </div>
      <div className="testerFeedbackData">
        <div className="rawValues">
          <p> Watched {(completion() * 100).toFixed(2)}% of video</p>
          <p>Like: {props.demographic.liked}/{props.demographic.total}</p>
          {props.feedback ? (
            <p> Notable comments: {props.feedback}</p>
          ) : (
              null
            )}
        </div>

        <div className="progressBars">
          <progress max={1} value={completion()}></progress>
          <br/><br/>
          <progress max={1} value={props.demographic.liked/props.demographic.total}></progress>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Feedback;