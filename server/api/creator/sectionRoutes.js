const db = require('../../../db/index.js');
const Sections = db.Section;
const Users = db.User;

exports.getRelatedSection = function(req, res) {
  Sections.findAll({
    where: {
      projectId: req.query.projectId
    }
  })
    .then((sectionsArray) => {
      res.send(sectionsArray);
    })
    .catch((err) => {
      res.send(err);
    })
};


exports.getTesters = function(req, res) {
  Users.findAll({
    where: {
      isCreator: false
    }
  })
    .then((testers) => {
      res.send(testers);
    })
    .catch((err) => {
      res.send('Error retrieving testers!', err);
    })
};