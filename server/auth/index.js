const bcrypt = require('bcrypt');
// const User = require('../../db/models/user.js');

exports.createAccount = (req, res) => {
  console.log('req.session:', req.session);
  console.log('req.body:', req.body);
};

exports.attemptLogin = (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
};