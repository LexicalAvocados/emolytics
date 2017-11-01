const db = require('../../../db/index.js');
const express = require('express');
const User = db.User;
const FocusGroup = db.FocusGroup;
const FocusGroupAndTester = db.FocusGroupAndTester;
const TesterAndOptions = db.TesterAndOption;
const Notifications = db.Notification;
const nodemailer = require('nodemailer');
const router = express.Router();
const FocusGroupAndTesterTemp = db.FocusGroupAndTesterTemp;



router.get('/getApply', (req, res) => {
  console.log('GETING TEMP');
	User.findOne({where: {username: req.session.username}})
		.then(user => {
			return (FocusGroupAndTesterTemp.findAll({where: {creatorId: user.dataValues.id, accepted: null}}))
		})
    .then(values => {
      // console.log(values);
      let users = [];
      for (var i = 0; i < values.length; i++) {
        users[i] = User.findOne({where: {id: values[i].dataValues.testerId}})
      }
      return Promise.all(users)
    })
    .then(users => {
      console.log(users);
      res.send(users);
    })
})

router.post('/applyTester', (req, res) => {
  console.log(req.body);
  User.findOne({where: {username: req.session.username}})
    .then(user => {
      if (req.body.focusGroup === 'none') {
        FocusGroupAndTesterTemp.findOne({where: {testerId: req.body.username.id, creatorId: user.dataValues.id}})
          .then(temp => {
            temp.update({
              accepted: false
            })
              .then(() => {
                res.send(true)
              })
          })
      } else {
        FocusGroupAndTesterTemp.findOne({where: {testerId: req.body.username.id, creatorId: user.dataValues.id}})
          .then(temp => {
            console.log(' TEMP', temp)
            temp.update({
              accepted: true
            })
          })
        return FocusGroup.findOne({where: {name: req.body.focusGroup, userId: user.dataValues.id}})

      }
    })
    .then(group => {
      return FocusGroupAndTester.create({
        userId: req.body.username.id,
        focusGroupId: group.dataValues.id,
        testerInvited: true,
        creatorInvited: true
      })
    })
    .then(() => {

    })
    .then(() => {
      res.send(true);
    })
    .catch(() => {
      res.send(false);
    })
})

















module.exports = router;