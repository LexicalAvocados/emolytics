const express = require('express');
const router = require('express').Router();
const db = require('../../../db/index.js');
const Sections = db.Section;

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
      res.send('Error finding relevant projects!');
    })
};


// const createProjectHandler = function(req, res) {
//   console.log(req)
// };

const Sequelize = require('sequelize');
const db = require('../../../db/models/project.js');

const Project = {};

Project.createProject = function(req, res) {
  // console.log('project');
  // Project['name'] = req.body.name;
  // Project['description'] = req.body.description;
  const newProject = project.create({
    name: Project.name,
    description: Project.description
  });
  res.send('something');
};

module.exports = Project;


// const createProject = function(req, res) {
//   console.log('console something')
//   res.send('return something')
// };

// module.exports.createProject = createProject;
