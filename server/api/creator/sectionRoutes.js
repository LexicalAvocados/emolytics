const db = require('../../../db/index.js');
const optionRoutes = require('./optionRoutes.js');
const Sections = db.Section;
const Users = db.User;
const Options = db.Option;

exports.getRelatedSection = function(req, res) {
  Sections.findAll({
    where: {
      projectId: req.query.projectId,
      deleted: false
    }
  })
    .then((sectionsArray) => {
      res.send(sectionsArray);
    })
    .catch((err) => {
      res.send(err);
    });
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
    });
};

exports.addSection = function(req, res) {
  Sections.create({
    name: req.body.name,
    description: req.body.description,
    projectId: req.body.projectId
  })
    .then((newSection) => {
      if (newSection) {
        res.send(newSection);
      }
    })
    .catch((err) => {
      console.log('Error creating new section', err);
      res.send(err);
    });
};

exports.deleteSection = (req, res) => { 
  Sections.findAll({
    where: {
      [req.query.toDelete]: req.query.id
    }
  }) 
    .then((sectionEntries) => {
      // may have to check if there are any
      sectionEntries.forEach((section) => {
        section.update({
          deleted: true
        });
        optionRoutes.deleteOption({ query: { toDelete: 'sectionId', id: section.id }}, null);
        if (res !== null) {
          res.send('Success');
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
