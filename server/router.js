const express = require('express');
const router = require('express').Router();
const testerRoutes = require('./api/tester');
const projectRoutes = require('./api/creator/projectRoutes.js')
const sectionRoutes = require('./api/creator/sectionRoutes.js')

router.use('/tester', testerRoutes);

router.get('/getRelatedSections', projectRoutes.getRelatedSection);

router.get('/getOptionsForSection', sectionRoutes.getRelatedOptions);

// router.post('/createProject', projectRoutes.createProjectHandler);

// router.post('/createProject', projectRoutes.createProject);

// router.post('/createProject', projectRoutes.createProject);

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