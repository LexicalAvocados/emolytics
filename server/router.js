const express = require('express');
const router = require('express').Router();
const projectRoutesHandler = require('./api/creator/projectRoutes.js');

router.post('/createProject', projectRoutesHandler.createProject);

// router.get('/', function(req, res) {
//   console.log('testing');
//   res.send('testing');
// });

// router.post('/', function(req, res) {
//   console.log('testing post');
//   res.send('testing post endpoint');
// });
// router.post('/createProject', function(req, res) {
//   res.send('createProject');
// });

module.exports = router;
