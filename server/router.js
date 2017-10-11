const express = require('express');
const router = require('express').Router();
<<<<<<< HEAD
const testerRoutes = require('./api/tester');



router.use('/tester', testerRoutes);
=======
const projectRoutes = require('./api/creator/projectRoutes.js')


router.get('/getRelatedSections', projectRoutes.getRelatedSection);
>>>>>>> Basic setup for request to server for all sections from projectHome complete

module.exports = router;
