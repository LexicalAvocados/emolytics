const express = require('express');
const router = require('express').Router();
const db = require('../../../db/index.js');
const Users = db.User;
const Projects = db.Project;

exports.getProjectsForUser = function(req, res) {
  // Incase not given id.
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
        })
    })
    .catch((err) => {
      console.log('Error retrieving user from db', err);
      res.send(err);
    })
};

exports.createProject = function(req, res) {
  console.log('req.session>>>>>>>>', req.session)
  // query users where username = req.session.username
  Users.findOne({
    where: {
      username: req.session.username
    }
  })
  // when found, grab entry, enter userID
  .then((user) => {
//.then
  const projectNameTaken = Projects.findOne({
    where: {
      name: req.body.name
    }
  })
    .then((projectNameTaken) => {
      if (projectNameTaken) {
        return res.send('Project with identical name already exists. Please rename your project');
      } else {
        const newProject = Projects.create({
          name: req.body.name,
          description: req.body.description,
          // userId: req.session.username.userid
          userId: user.id
        })
          .then((newProject) => {
            if (newProject) {
              // console.log('project added', newProject)
              res.send(newProject);
            } else {
              console.error('Could not create new project');
            }
          })
          .catch((err) => {
            console.error('Error creating new project', err);
          });
      }
    })
    .catch((err) => {
      console.error('Error finding existing project with identical name in db', err);
    });


  })
};





