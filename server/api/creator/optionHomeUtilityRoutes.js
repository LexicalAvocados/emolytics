const db = require('../../../db/index.js');
const Frame = db.Frame;
const sequelize = db.sequelize;
const TesterAndOption = db.TesterAndOption;
const pad = require('array-pad');

exports.organizeFramesByEmotion = (req, res) => {
  var originalFrames = req.body.frames;
  var duration = req.body.duration;
  var tempEmotionObj = {};
  var emotions = ["anger", "contempt", "disgust", "fear", "happiness", "neutral", "sadness", "surprise" ]

  emotions.forEach(emo => {
    let capitalized = emo.slice(0, 1).toUpperCase() + emo.slice(1);
    tempEmotionObj[emo] = originalFrames.sort((a, b) => a.time - b.time).reduce((acc, curr) => {
      if (emo === 'neutral') {
        if (acc[curr.time]) {
          acc[curr.time] = (acc[curr.time] + +curr[emo] / 8) / 2;
          return acc;
        } else {
          acc.push(+curr[emo] / 8);
          return acc;
        }
      }
      else {
        if (acc[curr.time]) {
          acc[curr.time] = (acc[curr.time] + +curr[emo] )/ 2;
          return acc;
        } else {
          acc.push(+curr[emo]); // eventually want to use acc[curr.time] = +curr[emo] and pad the array with null values interspersed
          return acc;
        }
      }
    }, [capitalized]);
    if (tempEmotionObj[emo].length < duration) {
      var diff = duration - tempEmotionObj[emo].length - 1;
      let padArr = pad([], diff, null);
      tempEmotionObj[emo] = tempEmotionObj[emo].concat(padArr);
    }
  });
  // console.log('tempEmotionObj', tempEmotionObj)
  res.send(JSON.stringify(tempEmotionObj));
};

exports.calculateCompletionPercentage = (req, res) => {

  // var array = req.body.array;
  var duration = req.body.duration;

  // let userCompletionObj = array.sort((a, b) => a.time - b.time).reduce((acc, curr) => {
  //   if (!acc[curr.userId]) acc[curr.userId] = 0;
  //   if (acc[curr.userId] >= 0) {
  //     if (curr.time > acc[curr.userId]) acc[curr.userId] = curr.time / duration
  //   }
  //   return acc;
  // }, {});
  // // console.log('completionObj', userCompletionObj);
  // var avgCompletion = 0;
  // var numberOfUsers = 0;
  // for (var key in userCompletionObj) {
  //   avgCompletion += userCompletionObj[key];
  //   numberOfUsers++;
  // }
  // avgCompletion = Math.floor(1000*(avgCompletion / numberOfUsers))/10;
  TesterAndOption.findAll({where: {optionId: req.body.optionId}})
    .then(data => {
      let total = data.length;
      let finished = 0;
      let liked = 0;
      console.log(data);
    })
  res.send(JSON.stringify(avgCompletion));
};
