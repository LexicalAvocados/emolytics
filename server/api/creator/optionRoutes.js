const db = require('../../../db/index.js');
const Options = db.Option;
const Likes = db.TesterAndOption;
const Users = db.User;


exports.getRelatedOptions = (req, res) => {
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

}

exports.getTestersForOption = (req, res) => {
  Likes.findAll({
    where: {
      optionId: req.query.optionId
    }
  })
    .then((options) => {
      let userIds = options.map((option) => {
        return option.userId
      })
      res.send(userIds);
    })
    .catch((err) => {
      console.log(err);
    })
}
