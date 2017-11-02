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
  let singleUserParam = req.body.userId ? `AND ${req.body.userId} = "userId" ` : ``;
  sequelize.query(`SELECT "time", AVG("attention") AS "Attention", COUNT("id") AS "Count", 
                   AVG("anger") AS "Anger", AVG("contempt") AS "Contempt", AVG("disgust") AS "Disgust", 
                   AVG("fear") AS "Fear", AVG("happiness") AS "Happiness", AVG("neutral") AS "Neutral", 
                   AVG("sadness") AS "Sadness", AVG("surprise") AS "Surprise" 
                   FROM "frames" 
                   WHERE "optionId" = ${req.body.optionId} ${singleUserParam}
                   GROUP BY "time" 
                   ORDER BY "time" ASC`, 
                   { type: sequelize.QueryTypes.SELECT})
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

exports.getFramesBasedOnUserDemographics = (req, res) => {
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
  var selectedRaces = req.body.selectedRaces;
  var selectedGenders = req.body.selectedGenders;
  var selectedAgeRanges = req.body.selectedAgeRanges;
  var optionId = req.body.optionId;

  var selectedRacesForQuery = '(';
  selectedRaces.forEach((race, i) => {
    if (i === selectedRaces.length - 1) {
      selectedRacesForQuery += `'${race}'`
    } else {
      selectedRacesForQuery += `'${race}',`
    }
  })
  selectedRacesForQuery += ')';
  // console.log('selected racesfor Query', selectedRacesForQuery)

  // var selectedRacesForQuery = (selectedRaces.join(','))
  // console.log('selected racesfor Query', selectedRacesForQuery)

  var selectedGendersForQuery = '(';
  selectedGenders.forEach((gender, i) => {
    if (i === selectedGenders.length - 1) {
      selectedGendersForQuery += `'${gender}'`
    } else {
      selectedGendersForQuery += `'${gender}',`
    }
  })
  selectedGendersForQuery += ')';
  // console.log('selected racesfor Query', selectedGendersForQuery)

  console.log('SELECTED AGE RANGES', selectedAgeRanges)
  var agesForQuery = [];
  selectedAgeRanges.forEach((ageRange) => {
    var lower = +ageRange.slice(0, 2);
    var higher = +ageRange.slice(3, 5);
    for (var i = lower; i <= (higher); i++) {
      agesForQuery.push(i)
    }
  })
  console.log('agesForQuery', agesForQuery)

  sequelize.query(

    `SELECT "time", AVG("attention") AS "Attention", COUNT("id") AS "Count", AVG("anger") AS "Anger", AVG("contempt") AS "Contempt", AVG("disgust") AS "Disgust", AVG("fear") AS "Fear", AVG("happiness") AS "Happiness", AVG("neutral") AS "Neutral", AVG("sadness") AS "Sadness", AVG("surprise") AS "Surprise"
    FROM "frames"

    WHERE "optionId" = ${req.body.optionId} AND

    "userId" in (SELECT id FROM users
    WHERE "race" in ${selectedRacesForQuery} AND
    "sex" in ${selectedGendersForQuery} AND
    "age"=ANY('{${agesForQuery.join(", ")}}'::int[])
    )

    GROUP BY "time" ORDER BY "time" ASC`, { type: sequelize.QueryTypes.SELECT})
    .then(emoData => {
      // console.log('EMO DATA', emoData)
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
            // console.log('feeling neutral')
            emotions.emotionPerc[feeling] += data[feeling] / 10;
          } else {
            emotions.emotionPerc[feeling] += parseFloat(data[feeling]);
          }
        }
      })
      for (feeling in emotions.emotionPerc) {
        // console.log(feeling);
        emotions.emotionPerc[feeling] = (emotions.emotionPerc[feeling] / total).toFixed(5);
      }

      res.send(emotions);
    })
}
