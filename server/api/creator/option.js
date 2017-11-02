const express = require('express');
const db = require('../../../db');
const Sequelize = require('sequelize');
const Option = db.Option;
const User = db.User;
const Frame = db.Frame;
const Key = db.Key;
const OptionAndAnnotation = db.OptionAndAnnotation;
const EyeTracking = db.EyeTracking;
const sequelize = db.sequelize;
const router = express.Router();




router.post('/addAnnotation', (req, res) => {
console.log(req.body);
  OptionAndAnnotation.findOne({where: {optionId: req.body.option.id, time: req.body.time}})
    .then(anno => {
      if (anno) {
        anno.update({
          emotion: req.body.emotion,
          desc: req.body.desc
        });
      } else {
        OptionAndAnnotation.create({
          optionId: req.body.option.id,
          time: req.body.time,
          emotion: req.body.emotion,
          desc: req.body.desc
        });
      }
    });
});

router.post('/getAllAnnotations', (req, res) => {
  // console.log('Get All Annotation', req.body.option);
  OptionAndAnnotation.findAll({where: {optionId: req.body.option.id}})
    .then(data => {
      // console.log('ALL DATA', data);
      let result = [];
      data.forEach(elem => {
        result.push(elem.dataValues);
      });
      res.send(result);
    });
});

router.post('/getDemographics', (req, res) => {
  // console.log(req.body);
  let response = {

  };
  sequelize.query(`SELECT * FROM "testerAndOptions" INNER JOIN "users" ON "testerAndOptions"."userId" = "users"."id" WHERE "testerAndOptions"."optionId" = ${req.body.id} AND "testerAndOptions"."finished" IS NOT NULL`, { type: sequelize.QueryTypes.SELECT})
    .then(data => {
      // console.log(data)
      let total = data.length;
      let liked = 0;
      let finished = 0;
      let age = 0;
      let ages = [];
      let male = 0;
      data.forEach(elem => {
        if (elem.like === true) {
          liked++;
        }
        if (elem.finished === true) {
          finished++;
        }
        if (elem.sex === 'Male') {
          male++;
        }
        age += elem.age;
        ages.push(elem.age)
      });
      response.total = total;
      response.liked =liked;
      response.finished = finished;
      response.age = age / total;
      response.male = male;
      response.ages = ages;
      // console.log(response);
      res.send(response);
    });
});
// "age" = ANY ('${"{" + agesForQuery.join(', ') +"}"}'::int[]))
//"age"=ANY('{40, 22, 29}'::int[])
router.get('/test', (req, res) => {
  console.log('RUN TEST FOR GET')
  var agesForQuery = [22,23,29];
  sequelize.query(
  `SELECT "time", AVG("attention") AS "Attention", COUNT("id") AS "Count", AVG("anger") AS "Anger", AVG("contempt") AS "Contempt", AVG("disgust") AS "Disgust", AVG("fear") AS "Fear", AVG("happiness") AS "Happiness", AVG("neutral") AS "Neutral", AVG("sadness") AS "Sadness", AVG("surprise") AS "Surprise"
    FROM "frames"
    WHERE "optionId" = ${3} AND
    "userId" in (SELECT id FROM users
    WHERE
    "age"=ANY('{${agesForQuery.join(", ")}}'::int[])
    )
    GROUP BY "time" ORDER BY "time" ASC`
    , { type: sequelize.QueryTypes.SELECT})
      .then(data => {
        console.log(data);
      })
})


router.post('/getEmotion', (req, res) => {
  let response = {};

  sequelize.query(`SELECT COUNT("id"), AVG("anger") as anger, AVG("contempt") as contempt, AVG("disgust") as disgust, AVG("fear") as fear, AVG("happiness") as happiness, AVG("neutral") as neutral, AVG("sadness") as sadness, AVG("surprise") as surprise, SUM("attention") FROM "frames" WHERE "optionId" =  ${req.body.id}`, { type: sequelize.QueryTypes.SELECT})
    .then(data => {
      // console.log('DATA AVG', data);
      res.send(data);
    });
});

router.post('/refreshDemographics', (req, res) => {
  let response = {};
  let selectedRaces = req.body.selectedRaces;
  let selectedGenders = req.body.selectedGenders;
  var selectedAgeRanges = req.body.selectedAgeRanges;
  let optionId = req.body.optionId

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

  var selectedGendersForQuery = '(';
  selectedGenders.forEach((gender, i) => {
    if (i === selectedGenders.length - 1) {
      selectedGendersForQuery += `'${gender}'`
    } else {
      selectedGendersForQuery += `'${gender}',`
    }
  })
  selectedGendersForQuery += ')';

  sequelize.query(`SELECT * FROM "testerAndOptions"
  INNER JOIN "users" ON "testerAndOptions"."userId" = "users"."id"
  WHERE "testerAndOptions"."optionId" = ${req.body.optionId}
  AND "testerAndOptions"."finished" IS NOT NULL
  AND "users"."id" in (SELECT id FROM "users"
  WHERE race in ${selectedRacesForQuery}
  AND sex in ${selectedGendersForQuery}
  AND "age"=ANY('{${agesForQuery.join(", ")}}'::int[])
  )`
  , { type: sequelize.QueryTypes.SELECT})
    .then(data => {
      // console.log(data)
      let total = data.length;
      let liked = 0;
      let finished = 0;
      let age = 0;
      let ages = [];
      let male = 0;
      data.forEach(elem => {
        if (elem.like === true) {
          liked++;
        }
        if (elem.finished === true) {
          finished++;
        }
        if (elem.sex === 'Male') {
          male++;
        }
        age += elem.age;
        ages.push(elem.age)
      });
      response.total = total;
      response.liked =liked;
      response.finished = finished;
      response.age = age / total;
      response.male = male;
      response.ages = ages;
      // console.log(response);
      res.send(response);
    });
})

router.post('/setPublicStatus', (req, res) => {
  Option.findOne({
    where: {
      id: req.body.optionId
    }
  })
  .then((option) => {
    option.update({
      isPublic: req.body.makePublic
    })
  })
  .then(() => {
    res.send('public settings set!')
  })
})


module.exports = router;
