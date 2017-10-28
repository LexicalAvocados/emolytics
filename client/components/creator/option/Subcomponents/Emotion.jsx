import React from 'react';

const Emotion = (props) => {

  const calcMaxEmotion = () => {
    // console.log('calcMaxEmotion obj:', obj);
    // var total = 0;
    // var max = ["emotion", 0]
    // for (var key in obj) {
    //   let currVal = obj[key].slice(1).reduce((sum, val) => sum+= +val, 0);
    //   total += currVal;
    //   if(currVal > max[1]) max = [ obj[key][0], currVal ]
    // }
    // let Emoshin = max[0][0].toUpperCase() + max[0].slice(1);
    // let stringForRender = `${Emoshin} (${Math.floor((max[1]/total)*1000)/10}%)`
    // console.log(props);
    if (props.optionEmotionObj.emotionPerc.anger) {
      return 'NAN'
    } else {
      let emotions = props.optionEmotionObj.emotionPerc
      let highest = { emotion: null, avg: 0 }
      for (var feeling in emotions) {
        // console.log('feeling', emotions[feeling])
        if (emotions[feeling] > highest.avg && feeling != 'time') {
          highest.emotion = feeling;
          highest.avg = emotions[feeling];
        }
      }

      return highest.emotion;
    }
  }

  return (
    <div className="testerEmotion">
      <h3 style={center}> Most Prevalent Emotion: {calcMaxEmotion()}</h3>
      <p className='chartHeader'> Overall Emotion Breakdown: </p>
      <div className='emotionChart'></div>
    </div>
  )
};

const center = {
  textAlign: "center"
}

export default Emotion;
