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

