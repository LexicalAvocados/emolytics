const db = require('../../../db/index.js');
const Options = db.Option;
const Likes = db.testerAndOptions;
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

  // Users.findAll({
  //   attributes: ['id'],
  //   where: {
  //     username: req.body.username
  //   }
  // })
  // .then((uid) => {
  //   Likes.findAll({
  //     where: {
  //       optionId: req.body.optionId,
  //       userId: uid
  //     }
  //   })
  //   .then((like) => {
  //     res.send(like)
  //   })
  //   .catch((err) => {
  //     res.send('Error retrieving Like on this option/user combo!')
  //   })
  // })
}
