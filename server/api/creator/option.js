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
// console.log(req.body);
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
      });
      response.total = total;
      response.liked =liked;
      response.finished = finished;
      response.age = age / total;
      response.male = male;
      // console.log(response);
      res.send(response);
    });
});


router.post('/getEmotion', (req, res) => {
  let response = {};

  sequelize.query(`SELECT COUNT("id"), AVG("anger") as anger, AVG("contempt") as contempt, AVG("disgust") as disgust, AVG("fear") as fear, AVG("happiness") as happiness, AVG("neutral") as neutral, AVG("sadness") as sadness, AVG("surprise") as surprise, SUM("attention") FROM "frames" WHERE "optionId" =  ${req.body.id}`, { type: sequelize.QueryTypes.SELECT})
    .then(data => {
      // console.log('DATA AVG', data);
      res.send(data);
    });
});


module.exports = router;
