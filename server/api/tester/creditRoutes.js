const db = require('../../../db/index.js');
const Sequelize = require('sequelize');
const sequelize = db.sequelize;
const User = db.User;
const Option = db.Option;
const Section = db.Section;
const Project = db.Project

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
      });
      res.send('successfully added credits!');
    });
};

exports.getCreditBalance = (req, res) => {
  User.findOne({
    where: {
      username: req.session.username || req.session.passport.user.username
    }
  })
    .then( (user) => {
      var credits = user.dataValues.credits;
      res.send(JSON.stringify(credits));
    });
};

exports.depleteCreditBalance = (req, res) => {
  User.update({credits: 0},
    {
      where: {
        id: req.body.userId
      }
    }
  )
    .then(affectedRows => {
      if (affectedRows[0] === 1) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch(err => {
      console.log('Error depleting user\'s credit balance:', err);
    });
};

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
      });
    })
    .then( () => {
      res.send('successfull added credits to option!');
    });
};

exports.allSponsoredOptions = (req, res) => {
  Option.findAll({})
    .then((options) => {
      return filteredOptions = options.filter(item => item.totalcredits !== null && item.totalcredits > 0 && item.creditsperview < item.totalcredits);
    })
    .then((filteredOptions) => {
      return Promise.all(filteredOptions.map(option => getCreatorDataForOption(option)))
        .then((data) => {
          // console.log('DATA FOR PROMISE ALL', data)
          let responseArr = data.filter((option) => option !== undefined)
          res.send(JSON.stringify(responseArr))
        })
    })
};

const getCreatorDataForOption = (option) => {
  // console.log('OPTION IN MAP FUNCTION', option)
  return Section.findOne({
    where: {
      id: option.dataValues.sectionId
    }
  })
  .then((sec) => {
    // console.log('SECTION IN MAP FUNCTION', sec)
    if (sec) {
      return Project.findOne({
        where: {
          id: sec.dataValues.projectId
        }
      })
      .then((proj) => {
        // console.log('PROJECT IN MAP FUNCTION', proj)
        if (proj) {
          return User.findOne({
            where: {
              id: proj.dataValues.userId
            }
          })
          .then((user) => {
            // console.log('OPTION IN LAST PROMISE IN MAP', option)
            option.dataValues['CrId'] = user.dataValues.id;
            option.dataValues['CrName'] = user.dataValues.username;
            return option;
          })
        }
      })
    }
  })
}
