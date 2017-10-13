const nodemailer = require('nodemailer');


exports.sendEmails = function(req, res) {
  // console.log('within emails', req.body);
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "reactionsyncer@gmail.com",
      pass: "reactionsync1"
    }
  });

  req.body.invitedArr.forEach((invitee, i) => {
    let mailOptions = {
      from: "ReactionSync",
      to: invitee.email,
      subject: "You've been invited!",
      text: "Guten Tag! You've been invited to something (if you've received this email)",
      html: `<p>This is a test! You get ${req.body.options[i].id}</p>`
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


//  options: 
// [ { id: 2,
//   name: 'Test Video 2',
//   description: 'blah blah blah',
//   youtubeUrl: 'https://www.youtube.com/watch?v=HzzmqUoQobc',
//   thumbnail: 'https://i.ytimg.com/vi/AcMmLmvOYTo/default.jpg',
//   length: 100,
//   createdAt: '2017-10-11T21:10:25.179Z',
//   updatedAt: '2017-10-11T21:10:25.179Z',
//   sectionId: 1 } ] }