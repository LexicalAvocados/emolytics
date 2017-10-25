const db = require('../../../db/index.js');
const User = db.User;
const FocusGroup = db.FocusGroup;
const FocusGroupAndTester = db.FocusGroupAndTester;
const TesterAndOptions = db.TesterAndOption;
const Notifications = db.Notification;
const nodemailer = require('nodemailer');

const routeForTesters = 'http://localhost:3000/login';


exports.sendEmails = function(req, res) {
  // console.log('within emails', req.body);
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'reactionsyncer@gmail.com',
      pass: 'reactionsync1'
    }
  });


  let options = req.body.options;
  let invitedArr = req.body.invitedArr;

  for (var i = 0; i < invitedArr.length; i++) {
    TesterAndOptions.create({
      optionId: options[i % options.length].id,
      userId: invitedArr[i].id
    });
    let mailOptions = {
      from: "ReactionSync",
      to: invitedArr[i].email,
      subject: "You've been invited!",
      text: "Guten Tag! You've been invited to something (if you've received this email)",
      html: `<p>Herzlich Willkommen! You've been invitied to participate in a nefarious study! Please check your Video Queue after logging in! Giddy up!</p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // return console.log(error);
        res.send('FAILURE');
      } else {
        // console.log('I think the email was sent.', info);
        res.send('Success');
      }
    });
  }
};


exports.createNewFocusGroup = (req, res) => {
  // console.log('createNewFocusGroup req.body:', req.body);
  User.findOne({
    where: {
      username: req.body.creatorUsername
    }
  })
    .then(creator => {
      return FocusGroup.create({
        name: req.body.focusGroupName,
        userId: creator.id
      });
    })
    .then(newFocusGroup => {
      console.log('New Focus Group created:', newFocusGroup);
      res.send(newFocusGroup.dataValues);
    })
    .catch(err => {
      console.log('Error creating new Focus Group');
      res.send(err);
    });
};


exports.deleteFocusGroup = (req, res) => {
  // console.log('deleteFocusGroup req.body:', req.body);
  User.findOne({
    where: {
      username: req.body.creatorUsername
    }
  })
    .then(creator => {
      return FocusGroup.destroy({
        name: req.body.focusGroupName,
        userId: creator.id
      });
    })
    .then(numOfDeletedRows => {
      console.log('numOfDeletedRows:', numOfDeletedRows);
      if (numOfDeletedRows === 1) res.send(true);
      else res.send(false);
    })
    .catch(err => {
      console.log('Error deleting Focus Group');
      res.send(err);
    });
};


exports.addTesterToFocusGroup = (req, res) => {
  // console.log('addTesterToFocusGroup req.body:', req.body);
  let tester = User.findOne({
    where: {
      username: req.body.testerUsername
    }
  });

  let focusGroup = FocusGroup.findOne({
    where: {
      name: req.body.focusGroupName
    }
  });

  Promise.all([tester, focusGroup])
    .then(values => {
      return FocusGroupAndTester.create({
        userId: values[0].id,
        focusGroupId: values[1].id
      });
    })
    .then(newDbEntry => {
      console.log('Associated', newDbEntry.userId, 'with Focus Group', newDbEntry.focusGroupId);
      res.send(true);
    })
    .catch(err => {
      console.log('Error associating Tester with Focus Group:', err);
      res.send(false);
    });
};


exports.removeTesterFromFocusGroup = (req, res) => {
  console.log('removeTesterFromFocusGroup req.body:', req.body);

  let tester = User.findOne({
    where: {
      username: req.body.testerUsername
    }
  });

  let focusGroup = FocusGroup.findOne({
    where: {
      name: req.body.focusGroupName
    }
  });

  Promise.all([tester, focusGroup])
    .then(values => {
      // console.log('values:', values);
      return FocusGroupAndTester.destroy({
        where: {
          userId: values[0].id,
          focusGroupId: values[1].id
        }
      });
    })
    .then(numOfDeletedRows => {
      // console.log('numOfDeletedRows:', numOfDeletedRows);
      if (numOfDeletedRows === 1) res.send(true);
      else res.send(false);
    })
    .catch(err => {
      res.send(err);
    });
};

exports.getCreatorFocusGroups = (req, res) => {
  // console.log('getCreatorFocusGroups req.query:', req.query);
  let creatorFocusGroups = [];

  User.findOne({
    where: {
      id: req.query.id
    }
  })
    .then(creator => {
      // console.log('1st then block');
      return FocusGroup.findAll({
        where: {
          userId: creator.dataValues.id
        }
      });
    })
    .then(groups => {
      // console.log('2nd then block');
      groups = groups.map(group => {
        group = group.dataValues;
        delete group.createdAt;
        delete group.updatedAt;
        group.testerIds = [];
        group.testers = [];
        return group;
      });

      creatorFocusGroups = groups;

      return Promise.all(groups.map(group => {
        return FocusGroupAndTester.findAll({
          where: {
            focusGroupId: group.id
          }
        });
      }));
    })
    .then(groupsAndTesters => {
      // console.log('3rd then block');
      console.log('groupsAndTesters:', groupsAndTesters.map(x => x.map(y => y.dataValues)));
      console.log('creatorFocusGroups:', creatorFocusGroups);

      groupsAndTesters.forEach(group => {
        group.forEach(dbEntry => {
          for (var i = 0; i < creatorFocusGroups.length; i++) {
            if (dbEntry.dataValues.focusGroupId === creatorFocusGroups[i].id) {
              creatorFocusGroups[i].testerIds.push(dbEntry.dataValues.userId);
            }
          }
        });
      });

      return Promise.all(groupsAndTesters.map(testersPerGroup => {
        return Promise.all(testersPerGroup.map(tester => {
          return User.findOne({
            where: {
              id: tester.dataValues.userId
            }
          });
        }));
      }));
    })
    .then(userDBEntries => {
      // console.log('4th then block');
      console.log('creatorFocusGroups:', creatorFocusGroups);
      console.log('userDBEntries:', userDBEntries.map(x => x.map(y => y.dataValues)));
      userDBEntries.forEach(group => {
        group.forEach(dbEntry => {
          for (var i = 0; i < creatorFocusGroups.length; i++) {
            for (var j = 0; j < creatorFocusGroups[i].testerIds.length; j++) {
              if (dbEntry.dataValues.id === creatorFocusGroups[i].testerIds[j]) {
                creatorFocusGroups[i].testers.push(dbEntry.dataValues.username);
              }
            }
          }
        });
      });
      // console.log('final product:', creatorFocusGroups);
      res.send(creatorFocusGroups);
    })
    .catch(err => {
      res.send(err);
    });
};

exports.getAllNotificationsForUser = (req, res) => {
  User.findOne({
    attributes: ['id'],
    where: {
      username: req.session.username || req.session.passport.user.username
    }
  })
    .then( (user) => {
      // console.log('user for notifications', user.dataValues.id);
      Notifications.findAll({
        where: {
          userId: user.dataValues.id
        }
      })
        .then( (allNotifs) => {
          res.send(JSON.stringify(allNotifs));
        });
    });
};
