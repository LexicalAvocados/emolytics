const express = require('express');
const db = require('../../db');
const Sequelize = require('sequelize');
const router = express.Router();


router.post('/forgotPassword', (req, res) => {
	console.log(req.body);
	
})




module.exports = router;