const bcrypt = require('bcrypt');
const db = require('../../db');

exports.createAccount = (req, res) => {
  console.log('createAccount req.body:', req.body);
  const saltRounds = 10;
  let {username, password, email} = req.body;

  bcrypt.genSalt(saltRounds)
    .then(salt => {
      return bcrypt.hash(password, salt);
    })
    .then(hash => {
      return db.User.create({
        username,
        password,
        email
      });
    })
    .then(newUser => {
      req.session.username = username;
      newUser = newUser.dataValues;
      console.log('New User inserted:', newUser);
      delete newUser.password;
      let responseObj = JSON.stringify({
        loggedIn: true,
        userData: newUser,
      });
      res.setHeader('Content-Type', 'application/json');
      res.send(responseObj);
    })
    .catch(err => console.log('Account creation error!'));
};

exports.attemptLogin = (req, res) => {
};