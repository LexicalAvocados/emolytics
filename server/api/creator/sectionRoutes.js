const db = require('../../../db/index.js');
const optionRoutes = require('./optionRoutes.js');
const Sections = db.Section;
const Users = db.User;
const Options = db.Option;

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
  Sections.destroy({
    where: {
      id: req.query.sectionId
    }
  }) // Will set the sectionId to null in options
  .then((data) => { // Have to check to see if there are any first
    Options.findAll({
      where: {
        sectionId: null
      }
    })
    .then((allOptions) => {
      console.log('ALL Options', allOptions);
      optionRoutes.deleteOption({ query: { optionId: null, toDelete: 'sectionId'}}, null);
    })
  })
  // optionRoutes.deleteOption
  // Now go through the options, for each option, run previous function.
  res.send('found it');
}
