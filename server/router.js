const express = require('express');
const router = require('express').Router();
const testerRoutes = require('./api/tester');
const sectionRoutes = require('./api/creator/sectionRoutes.js');
const optionRoutes = require('./api/creator/optionRoutes.js');

router.use('/tester', testerRoutes);


router.get('/getRelatedSections', sectionRoutes.getRelatedSection);

router.get('/getOptionsForSection', optionRoutes.getRelatedOptions);

module.exports = router;
