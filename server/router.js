const express = require('express');
const router = require('express').Router();
const testerRoutes = require('./api/tester');



router.use('/tester', testerRoutes);

module.exports = router;
