const db = require('../../../db/index.js');
const Options = db.Option;
<<<<<<< HEAD
const Likes = db.testerAndOptions;
=======
const Likes = db.TesterAndOption;
>>>>>>> like
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

}
