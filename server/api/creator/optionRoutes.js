const db = require('../../../db/index.js');
const Options = db.Option;
const Likes = db.TesterAndOption;
const Users = db.User;


exports.getRelatedOptions = function(req, res) {
  Options.findAll({
    where: {
      sectionId: req.query.sectionId
    }
  })
    .then((optionsArray) => {
      res.send(optionsArray);
    })
    .catch((err) => {
      res.send('Error retrieving options!');
    })
};

exports.getUserLikeOnOption = (req, res) => {
  Users.findOne({
    attributes: ['id'],
    where: {
      username: req.body.username
    }
  })
  .then((uid) => {
    Likes.findOne({
      where: {
        optionId: req.body.optionId,
        userId: uid.dataValues.id
      }
    })
    .then((like) => {
      console.log('Final Like', like)
      res.send(like)
    })
    .catch((err) => {
      res.send('Error retrieving Like on this option/user combo!')
    })
  })
};

exports.getUsersIdsWhoWatced = (req, res) => {
   Likes.findAll({
    attributes: ['userId'],
    where: {
      optionId: req.body.optionId
    }
  })
  .then( (usersIdsArr) => {
      res.send(JSON.stringify(usersIdsArr));
    })
  .catch((err) => console.error('err in getting userids', err))
};

exports.getUsersNamesWhoWatced = (req, res) => {
   Users.findAll({
    where: {
      id: req.body.userId
    }
  })
  .then( (userObj) => {
    res.send(JSON.stringify(userObj));
  })
  .catch((err) => console.error('err in getting usernames', err))
}
