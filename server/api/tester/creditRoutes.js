const db = require('../../../db/index.js');
const Sequelize = require('sequelize');
const sequelize = db.sequelize;
const User = db.User;
const Option = db.Option;

exports.addCredits = (req, res) => {
  User.findOne({
    where: {
      username: req.session.username || req.session.passport.user.username
    }
  })
  .then( (user) => {
    // user.dataValues.credits += +req.body.amount;
    // user.save();
    let oldCredits = +user.dataValues.credits;
    let newCredits = oldCredits + +req.body.amount;
    user.update({
      credits: newCredits
    })
    res.send('successfully added credits!')
  })
}

exports.getCreditBalance = (req, res) => {
  User.findOne({
    where: {
      username: req.session.username || req.session.passport.user.username
    }
  })
  .then( (user) => {
    var credits = user.dataValues.credits;
    res.send(JSON.stringify(credits))
  })
}

exports.addCreditsToOption = (req, res) => {
  Option.findOne({
    where: {
      id: req.body.optionId
    }
  })
  .then( (option) => {
    option.update({
      totalcredits: req.body.total,
      creditsperview: req.body.perView
    })
  })
  .then( () => {
    res.send('successfull added credits to option!')
  })
}

exports.allSponsoredOptions = (req, res) => {
  Option.findAll({})
  .then((options) => {
    // console.log('OPTINOS', options)
    return options.filter(item => item.totalcredits !== null && item.totalcredits > 0 && item.creditsperview < item.totalcredits);
  })
  .then((filteredOptions) => {
    res.send(JSON.stringify(filteredOptions))
  })
}
