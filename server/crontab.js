const schedule = require('node-schedule');
const db = require('../db/index.js');
const User = db.User;
const FocusGroup = db.FocusGroup;
const Projects = db.Project;
const FocusGroupAndTester = db.FocusGroupAndTester;
const TesterAndOptions = db.TesterAndOption;
const nodemailer = require('nodemailer');



// var j = schedule.scheduleJob('20 * * * * *', function(){
//   console.log('The answer to life, the universe, and everything!');
//   User.findOne({where: {isCreator: true}})
//     .then(users => {
//       console.log(users);
//       Project.findOne({where: {userId: users.dataValues.id}})
//         .then(projects => {
          
//         })
//     })






  // let transporter = nodemailer.createTransport({
  //   service: "Gmail",
  //   auth: {
  //     user: "reactionsyncer@gmail.com",
  //     pass: "reactionsync1"
  //   }
  // });

  // let mailOptions = {
  //   from: "ReactionSync",
  //   to: req.body.invitedArr[i].email,
  //   subject: "You've been invited!",
  //   text: "Guten Tag! You've been invited to something (if you've received this email)",
  //   html: `<p>Herzlich Willkommen! You've been invitied to participate in a nefarious study! Please enter promo code ${option.id} at ${routeForTesters} after logging in! Giddy up!</p>`
  // };

  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     // return console.log(error);
  //     res.send('FAILURE');
  //   } else {
  //     console.log('I think the email was sent.', info);
  //     res.send('Success');
  //   }
  // });


// });

