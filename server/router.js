const express = require('express');
const router = require('express').Router();
const projectRoutes = require('./api/creator/projectRoutes.js')
const sectionRoutes = require('./api/creator/sectionRoutes.js')


router.get('/getRelatedSections', projectRoutes.getRelatedSection);

router.get('/getOptionsForSection', sectionRoutes.getRelatedOptions);

module.exports = router;
