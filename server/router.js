const express = require('express');
const router = require('express').Router();
const testerRoutes = require('./api/tester');
const projectRoutes = require('./api/creator/projectRoutes.js')
const sectionRoutes = require('./api/creator/sectionRoutes.js')



router.use('/tester', testerRoutes);

router.get('/getOptionsForSection', sectionRoutes.getRelatedOptions);

module.exports = router;
