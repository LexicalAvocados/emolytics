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
          userId: user.id,
          deleted: false
        }
      })
        .then((projects) => {
          if (projects.length) {
            res.send(projects);
          } else {
            Projects.findById(0)
              .then((demoProject) => {
                res.send([demoProject]);
              });
          }
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

//{ id: '135', name: 'cooooll', description: 'ooooo' }
exports.updateProject = (req, res) => {
  let toFind = req.query.toEdit;
  toFind = db[toFind];
  
  toFind.findById(req.query.id)
    .then((databaseEntry) => {
      databaseEntry.update({
        name: req.query.name,
        description: req.query.description
      })
        .then((updated) => {
          res.send(updated);
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

exports.deleteProject = (req, res) => {
  Projects.findById(req.query.id)
    .then((entry) => {
      entry.update({
        deleted: true
      })
        .then((updatedEntry) => {
          sectionRoutes.deleteSection({ query: { toDelete: 'projectId', id: req.query.projectId}}, null);
          res.send('Success');
        })
        .catch((err) => {
          console.log(err);
        })
    })
    .catch((err) => {
      console.log('Project not found', err);
      res.send(err);
    });
      

};