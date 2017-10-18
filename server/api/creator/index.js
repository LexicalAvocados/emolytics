const db = require('../../../db/index.js');
const nodemailer = require('nodemailer');
const TesterAndOptions = db.TesterAndOption;

const routeForTesters = "http://localhost:3000/login"


exports.sendEmails = function(req, res) {
  console.log('within emails', req.body);
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "reactionsyncer@gmail.com",
      pass: "reactionsync1"
    }
  });

  req.body.invitedArr.forEach((invitee) => {
    // TesterAndOptions.create({
    //   optionId: req.body.option.id,
    //   userId: invitee.id
    // });
    let mailOptions = {
      from: "ReactionSync",
      to: invitee.email,
      subject: "You've been invited!",
      text: "Guten Tag! You've been invited to something (if you've received this email)",
      html: `<p>Herzlich Willkommen! You've been invitied to participate in a nefarious study! Please enter promo code ${req.body.sectionId} at ${routeForTesters} after logging in! Giddy up!</p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // return console.log(error);
        res.send('FAILURE');
      } else {
        console.log('I think the email was sent.', info);
        res.send('Success');
      }
    })
  });
};