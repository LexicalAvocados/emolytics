const express = require('express');
const router = require('express').Router();
const projectRoutes = require('./api/creator/projectRoutes.js')


router.get('/getRelatedSections', projectRoutes.getRelatedSection);

module.exports = router;
