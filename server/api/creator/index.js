const nodemailer = require('nodemailer');


exports.sendEmails = function(req, res) {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "reactionsyncer@gmail.com",
      pass: "reactionsync1"
    }
  });

  req.body.invitedArr.forEach((invitee) => {
    let mailOptions = {
      from: "ReactionSync",
      to: invitee.email,
      subject: "You've been invited!",
      text: "Guten Tag! You've been invited to something (if you've received this email)",
      html: "<p>This is a test</p>"
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      } else {
        return console.log('I think the email was sent.', info);
      }
    })
  });
};