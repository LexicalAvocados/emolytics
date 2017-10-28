const db = require('../../../db/index.js');
const Frame = db.Frame;
const sequelize = db.sequelize;

exports.getRelevantFrames = (req, res) => {
  // Frame.findAll({
  //   where: {
  //     optionId: req.body.optionId
  //   }
  // })
  //   .then((optionsArray) => {
  //     res.send(optionsArray);
  //   })
  //   .catch((err) => {
  //     res.send('Error retrieving options!');
  //   });
  let emotions = {
    emotionAvg: [['Anger'],['Contempt'],['Disgust'],['Fear'],['Happiness'],['Neutral'],['Sadness'],['Surprise']],
    attention: ['Attention'],
    count: [],
    emotionPerc: {
      Anger: 0,
      Contempt: 0,
      Disgust: 0,
      Fear: 0,
      Happiness: 0,
      Neutral: 0,
      Sadness: 0,
      Surprise: 0
    }
  };
  sequelize.query(`SELECT "time", AVG("attention") AS "Attention", COUNT("id") AS "Count", AVG("anger") AS "Anger", AVG("contempt") AS "Contempt", AVG("disgust") AS "Disgust", AVG("fear") AS "Fear", AVG("happiness") AS "Happiness", AVG("neutral") AS "Neutral", AVG("sadness") AS "Sadness", AVG("surprise") AS "Surprise" FROM "frames" WHERE "optionId" = ${req.body.optionId} GROUP BY "time" ORDER BY "time" ASC`, { type: sequelize.QueryTypes.SELECT})
    .then(emoData => {
      let total = emoData.length;
      emoData.forEach(data => {
        emotions.emotionAvg[0].push(parseFloat(data.Anger));
        emotions.emotionAvg[1].push(parseFloat(data.Contempt));
        emotions.emotionAvg[2].push(parseFloat(data.Disgust));
        emotions.emotionAvg[3].push(parseFloat(data.Fear));
        emotions.emotionAvg[4].push(parseFloat(data.Happiness));
        emotions.emotionAvg[5].push(data.Neutral/10);
        emotions.emotionAvg[6].push(parseFloat(data.Sadness));
        emotions.emotionAvg[7].push(parseFloat(data.Surprise));
        emotions.attention.push(data.Attention);
        emotions.count.push(data.Count)
        for (feeling in data) {
          if (feeling === "Neutral") {
            console.log('feeling neutral')
            emotions.emotionPerc[feeling] += data[feeling] / 10;
          } else {
            emotions.emotionPerc[feeling] += parseFloat(data[feeling]);
          }
        }
      })
      for (feeling in emotions.emotionPerc) {
        console.log(feeling);
        emotions.emotionPerc[feeling] = (emotions.emotionPerc[feeling] / total).toFixed(5);
      }
      
      res.send(emotions);
    })
};
