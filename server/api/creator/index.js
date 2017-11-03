const db = require('../../../db/index.js');
const User = db.User;
const FocusGroup = db.FocusGroup;
const FocusGroupAndTester = db.FocusGroupAndTester;
const PatreonCampaign = db.PatreonCampaign;
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
  console.log('OPTION BEING SENT TO THE BACKEND', req.body.options); // Logged end
  for (var i = 0; i < invitedArr.length; i++) {
    console.log('i:', i, 'options.length:', options.length);
    TesterAndOptions.create({
      optionId: options[i % (options.length - 1)].id,
      userId: invitedArr[i].id
    })
    let mailOptions = {
      from: 'ReactionSync',
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

  let user = User.findOne({
    where: {
      username: req.body.creatorUsername
    }
  });

  if (req.body.patrons) {
    var campaign = PatreonCampaign.findOne({
      where: {
        campaignId: Number(req.body.campaignId)
      }
    });
  }

  Promise.all([user, campaign])
    .then(data => {
      return FocusGroup.create({
        name: req.body.focusGroupName,
        userId: data[0].id,
        patreonCampaignId: (data[1] ? data[1].id : null)
      });
    })
    .then(newFocusGroup => {
      newFocusGroup = newFocusGroup.dataValues;
      if (req.body.patrons) {
        addPatronsToFocusGroup(newFocusGroup.id, req.body.patrons)
          .then(data => {
            res.send({group: newFocusGroup, patrons: req.body.patrons, patreonCampaignId: req.body.campaignId});
          })
          .catch(err => {
            console.log('Error associating Patrons with new Group:', err);
          });
      } else {
        res.send(newFocusGroup);
      }
    })
    .catch(err => {
      console.log('Create new Focus Group error:', err);
      res.send(err);
    });
};


const addPatronsToFocusGroup = (groupId, patrons) => {
  return Promise.all(patrons.map(patron => {
    return FocusGroupAndTester.create({
      userId: patron.id,
      focusGroupId: groupId
    });
  }));
};


exports.deleteFocusGroup = (req, res) => {
  // console.log('deleteFocusGroup req.body:', req.body);
  FocusGroup.destroy({
    where: {
      name: req.body.focusGroup.name,
      userId: req.body.userId
    }
  })
    .then(numOfDeletedRows => {
      // console.log('numOfDeletedRows:', numOfDeletedRows);
      if (numOfDeletedRows === 1) res.send(true);
      else res.send(false);
    })
    .catch(err => {
      console.log('Error deleting Focus Group:', err);
      res.send(err);
    });
};


exports.addTesterToFocusGroup = (req, res) => {
  // console.log('addTesterToFocusGroup req.body:', req.body);
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'reactionsyncer@gmail.com',
      pass: 'reactionsync1'
    }
  });
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
  let userEmail;
  Promise.all([tester, focusGroup])
    .then(values => {
      userEmail = values[0].email;
      return FocusGroupAndTester.create({
        userId: values[0].id,
        focusGroupId: values[1].id,
        creatorInvited: true,
      });
    })
    .then(newDbEntry => {
      console.log('Associated', newDbEntry.userId, 'with Focus Group', newDbEntry.focusGroupId);
      return newDbEntry
    })
    .then((newDbEntry) => {
      console.log('USER EMAIL', userEmail)
      let mailOptions = {
        from: 'ReactionSync',
        to: userEmail,
        subject: "You've been invited to a Focus Group!",
        text: "Guten Tag! You've been invited to something (if you've received this email)",
        html: `<p>Herzlich Willkommen! You have been invited to a focus group. Follow this link to join: http://localhost:3001/joinGroup Enter ${newDbEntry.focusGroupId} to join.</p>`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          // return console.log(error);
          res.send(false);
        } else {
          // console.log('I think the email was sent.', info);
          res.send(true);
        }
      });
    })
    .catch(err => {
      console.log('Error associating Tester with Focus Group:', err);
      res.send(false);
    });
};


exports.removeTesterFromFocusGroup = (req, res) => {
  // console.log('removeTesterFromFocusGroup req.body:', req.body);

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

  FocusGroup.findAll({
    where: {
      userId: req.query.id,
    }
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
            focusGroupId: group.id,
            creatorInvited: true
          }
        });
      }));
    })
    .then(groupsAndTesters => {
      // console.log('3rd then block');
      // console.log('groupsAndTesters:', groupsAndTesters.map(x => x.map(y => y.dataValues)));
      // console.log('creatorFocusGroups:', creatorFocusGroups);

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
      // console.log('creatorFocusGroups:', creatorFocusGroups);
      // console.log('userDBEntries:', userDBEntries.map(x => x.map(y => y.dataValues)));
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
      console.log('final product:', creatorFocusGroups);
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
          userId: user.dataValues.id,
          seen: false
        }
      })
        .then( (allNotifs) => {
          res.send(JSON.stringify(allNotifs));
        });
    });
};

exports.markNotificationAsSeen = (req, res) => {
  var optionName = req.body.optionName;
  Notifications.findAll({
    where: {
      optionName: optionName
    }
  })
  .then((notifsToMark) => {
    // console.log('notifToMark', notifsToMark)
    notifsToMark.forEach((notif) => {
      notif.update({
        seen: true
      })
      .then((updated) => {
        console.log('updated', updated)
      })
    })
  })
  .then(() => {
    res.send('Marked as Seen!')
  })
};
