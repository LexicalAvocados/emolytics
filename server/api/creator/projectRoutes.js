const express = require('express');
const router = require('express').Router();
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