const express = require('express');
const router = require('express').Router();
const db = require('../../../db/index.js');
const sectionRoutes = require('./sectionRoutes.js');
const Users = db.User;
const Projects = db.Project;
const Sections = db.Section;

exports.getProjectsForUser = function(req, res) {
  // In case not given id.
  Users.findOne({
    where: {
      username: req.query.username
    }
  })
    .then((user) => {
      Projects.findAll({
        where: {
          userId: user.id
        }
      })
        .then((projects) => {
          res.send(projects);
        })
        .catch((err) => {
          console.log('Error finding projects associated with the user', err);
        });
    })
    .catch((err) => {
      console.log('Error retrieving user from db', err);
      res.send(err);
    });
};

exports.createProject = function(req, res) {
  Users.findOne({
    where: {
      username: req.session.username || req.session.passport.user.username
    }
  })
    .then((user) => {
      Projects.create({
        name: req.body.name,
        description: req.body.description,
        userId: user.id
      })
        .then((newProject) => {
          if (newProject) {
            res.send(newProject);
          } else {
            console.error('Could not create new project');
          }
        })
        .catch((err) => {
          console.error('Error creating new project', err);
        });
        })
        .catch((err) => {
          console.error('Error finding existing project with identical name in db', err);
        });
    };


exports.deleteProject = (req, res) => {
  Projects.destroy({
    where: {
      id: req.query.projectId
    }
  })
  .then((data) => {
    sectionRoutes.deleteSection({ query: { sectionId: null, toDelete: 'projectId'}}, null);
    return 'Success';
  })
  .then((deleted) => { 
      res.send(deleted);
  })
};