import React from 'react';
import $ from 'jquery';

const DetailsPanel = (props) => {

  const calcAvgAtten = (arr) => {
    return (Math.floor(100*arr.reduce((sum, val) => sum += val, 0)/arr.length)*100)/100;
  }

  const calcLostFocus = (arr) => {
    let moments = [];
    for (var i = 0; i < 5; i++) {
      var min = Math.min.apply(null, arr)
      var indexAndSecond = arr.indexOf(min);
      var boredObj = {
        time: indexAndSecond,
        value: min
      }
      moments.push(boredObj);
      arr.splice(indexAndSecond, 1);
    }
    moments = moments.sort((a, b) => a.time - b.time)
    return moments;
  }

  const calcMaxEmotion = (obj) => {
    var total = 0;
    var max = ["emotion", 0]
    for (var key in obj) {
      let currVal = obj[key].slice(1).reduce((sum, val) => sum+= +val, 0);
      total += currVal;
      if(currVal > max[1]) max = [ obj[key][0], currVal ]
    }
    let Emoshin = max[0][0].toUpperCase() + max[0].slice(1);
    let stringForRender = `${Emoshin} (${Math.floor((max[1]/total)*10000)/100}%)`
    return stringForRender;
  }

  const timeClickCb = (e) => {
    var desired = $(e.target)[0].innerText;
    var seconds = desired.slice(0, desired.length - 1)
    props.timestampCallback(seconds)
  }

  return (
    <div className='testerAnalyticsContainer'>

      <div className="testerDetails">
        <h3 className='testerNameHeader'>Viewer: {props.user.name}</h3>
        <p> Age: {props.user.age} </p>
        <p> Gender: {props.user.gender} </p>
        <hr/>
      </div>

      <div className="testerEmotion">
        <p> Most Prevalent Emotion: {calcMaxEmotion(props.emotionsObj)}</p>
        <p className='chartHeader'> Overall Emotion Breakdown: </p>
        <div className='emotionChart'></div>
      </div><hr/>

      <div className="bottomPanelContainer">

        <div className="testerAttention">
          <p> Average Attention: {calcAvgAtten(props.attention.slice(1))}%</p>
          <p> Moments user lost focus: </p>
          <ul>
            {calcLostFocus(props.attention.slice(4)).map((moment) => (
              <li key={moment.time}>
                <a onClick={timeClickCb} className='lapseInFocus'>
                  {moment.time}s
                </a>
                <a> - </a>
                <a>
                  ({moment.value*100}%)
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="testerFeedback">
          <p> Watched {props.completionStatus}% of video</p>
          <p>Like: {props.likeStatus.toString()}</p>
          <p> Comments: </p>
        </div>

      </div>

    </div>
  )
}

export default DetailsPanel;
