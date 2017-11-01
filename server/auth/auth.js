const express = require('express');
const Sequelize = require('sequelize');
const db = require('../../db');
const sequalize = db.sequalize;
const User = db.User;
const ForgotPassword = db.ForgotPassword;
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');



router.post('/forgotPassword', (req, res) => {
	// console.log(req.body);
	let email, id, hash;
	hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	User.findOne({where: {username: req.body.username}})
		.then(user=> {
			// console.log(user);
			id = user.dataValues.id
			email = user.dataValues.email
			ForgotPassword.findOne({where: {userId: id}})
				.then(forgot => {
					// console.log(forgot)
					if (!forgot) {
						ForgotPassword.create({
							userId: id,
							link: hash
						})
					} else {
						forgot.update({
							link: hash
						})
					}
				})
				.then(() => {
					let transporter = nodemailer.createTransport({
						service: "Gmail",
						auth: {
						  user: "reactionsyncer@gmail.com",
						  pass: "reactionsync1"
						}
					});

					let mailOptions = {
						from: "ReactionSync",
						to: email,
						subject: "Change your password",
						text: "Guten Tag! You've been invited to something (if you've received this email)",
						html: `<p>Herzlich Willkommen! You want to change your password? http://localhost:3001/reset/${hash}</p>`
					};

					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
						  // return console.log(error);
						  console.log('FAILURE');
						} else {
						  // console.log('I think the email was sent.', info);
						  console.log('Success');
						}
					});
				})
				.then(() => {
					res.send('good')
				})
		})
		.catch(err => {
			res.send('bad')
		})

})


router.post('/resetPassword', (req, res) => {
  console.log(req.body);
  let currentUser;
	ForgotPassword.findOne({where: {link: req.body.link}})
    .then(forgot => {
      return User.findOne({where: {id: forgot.dataValues.userId}})
    })
    .then(user => {
      currentUser = user;
      return bcrypt.hash(req.body.password, 10)
    })
    .then(hash => {
      return currentUser.update({
        password: hash
      })
    })
    .then(good => {
      res.send('good');
    })
    .catch(err => {
      res.send('bad');
    })
})

router.get('/vimeoUserDatabaseEntry', (req, res) => {
	User.findOne({
		where: {
			username: req.query.username
		}
	})
	.then((userObj) => {
		console.log('VIMEO USER', userObj)
		res.send(JSON.stringify(userObj))
	})
})




module.exports = router;