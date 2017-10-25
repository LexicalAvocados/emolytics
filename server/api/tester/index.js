const express = require('express');
const db = require('../../../db');
const Sequelize = require('sequelize');
const Option = db.Option;
const User = db.User;
const Frame = db.Frame;
const Key = db.Key;
const sequelize = db.sequelize;
const TesterAndOption = db.TesterAndOption;
const SectionComments = db.SectionComments;
const Notifications = db.Notification;
const Section = db.Section;
const Project = db.Project;
const router = express.Router();
const base64Img = require('base64-img');
const request = require('request-promise-native');
const imageDataURI = require('image-data-uri');
const path = require('path');
const axios = require('axios');


// Option.create({
// 	name: 'Test Video',
// 	description: 'Video used to test users for playing youtube video',
// 	youtubeUrl: 'https://www.youtube.com/watch?v=8A3R_xz7nJQ&list=LL_uyk3EWD4JyUBgDCCfLLTQ&index=26',
// 	thumbnail: 'asdf',
// 	length: 100
// })

router.post('/getOptionsForTester', (req, res) => {
  console.log('getOptionsForTester req.body:', req.body);
  let id = req.body.id;

  // for a tester's Queue, we want table rows where "finished" is NULL (they have not opened a given Option page)
  // for a tester's History, we want table rows where "finished" is NOT NULL (they opened a given Option page)
  let mode = req.body.mode === 'queue' ? 'NULL' : 'NOT NULL'

  sequelize.query(`SELECT "testerAndOptions"."createdAt" AS "assignedAt", "testerAndOptions"."userId",
                  "options"."id", "options"."name", "options"."description", "options"."youtubeUrl", "options"."thumbnail",
                  "options"."length", "options"."createdAt", "options"."updatedAt", "options"."sectionId"
                  FROM "testerAndOptions" INNER JOIN "options"
                  ON "testerAndOptions"."optionId" = "options"."id"
                  WHERE ${id} = "testerAndOptions"."userId" AND "testerAndOptions"."finished" IS ${mode}
                  ORDER BY "testerAndOptions"."createdAt";`)
    .then(optionsTuple => {
      res.send(optionsTuple[0]);
    })
    .catch(err => {
      res.send(err);
    });
});

router.post('/getOptionResultsForTester', (req, res) => {
  console.log('getOptionResultsForTester req.body:', req.body);

  let frames = Frame.findAll({
    where: {
      userId: req.body.userId,
      optionId: req.body.optionId
    },
    order: [['createdAt']]
  });

  let testerOptionData = TesterAndOption.findOne({
    where: {
      userId: req.body.userId,
      optionId: req.body.optionId
    }
  });

  Promise.all([frames, testerOptionData])
    .then(optionResults => {
      res.send(optionResults);
    })
    .catch(err => {
      res.send(err);
    });

});

router.post('/getVideo', (req, res) => {
	console.log('req session', req.session);
  console.log(req.body);
  var id = parseInt(req.body.id)
	Option.findAll({
		where: {
			id: id
		}
	})
		.then(data => {
      res.send(data);
    })
})

router.post('/sendFrame', (req, res) => {
  console.log('REQ.SESSION.USERNAME:', req.session.username);
  var emotions = req.body.emotions;
  console.log('REQ SESSION', req.session)
	User.findAll({
		where: {
			username: req.session.username
		}
	})
	  .then(user => {

      let userArr = user;
      if (emotions) {

        Frame.findOne({where: {optionId: req.body.option.id, userId: userArr[0].dataValues.id, time: req.body.time}})
          .then(frame => {
            if (frame) {
              frame.update ({
                attention : 1,
                anger: emotions.anger,
                contempt: emotions.contempt,
                disgust: emotions.disgust,
                fear: emotions.fear,
                happiness: emotions.happiness,
                neutral: emotions.neutral / 3,
                sadness: emotions.sadness,
                surprise: emotions.surprise,
              })
                .then(entry => {
                  res.send(entry);
                })
            } else {
              Frame.create({
                attention : 1,
                time: req.body.time,
                anger: emotions.anger,
                contempt: emotions.contempt,
                disgust: emotions.disgust,
                fear: emotions.fear,
                happiness: emotions.happiness,
                neutral: emotions.neutral / 3,
                sadness: emotions.sadness,
                surprise: emotions.surprise,
                userId: user[0].dataValues.id,
                optionId: req.body.option.id
              })
                .then(entry => {
                  res.send(entry);
                })
              }
            })
      } else {
        Frame.findOne({where: {optionId: req.body.option.id, userId: userArr[0].dataValues.id, time: req.body.time}})
          .then(frame => {
            if (frame) {
              frame.update ({
                attention : 0,
                anger: 0,
                contempt: 0,
                disgust: 0,
                fear: 0,
                happiness: 0,
                neutral: 0,
                sadness: 0,
                surprise: 0,
              })
                .then(entry => {
                  res.send(entry);
                })
            } else {
              Frame.create({
                attention : 0,
                time: req.body.time,
                anger: 0,
                contempt: 0,
                disgust: 0,
                fear: 0,
                happiness: 0,
                neutral: 0,
                sadness: 0,
                surprise: 0,
                userId: user[0].dataValues.id,
                optionId: req.body.option.id
              })
                .then(entry => {
                  res.send(entry);
              })
            }
                    })
   }
})
        })

router.post('/likeVideo', (req, res) => {
  var creatorId; //for closure access
  User.findAll({
    where: {
      username: req.session.username
    }
  })
    .then(user => {
      console.log(user[0].dataValues);
      TesterAndOption.findOrCreate({where: {optionId: req.body.option.id, userId: user[0].dataValues.id}})
        .spread((entry, created) => {
          console.log('ENTRY', entry)
          entry.update({
            finished: true,
            like: req.body.like,
            comment: req.body.comment
          })
          .then((data) => {
            aggregateComments(req.body.option)
            console.log(created);
            res.send('finished');
          })
        })
    })
    .then( () => {
      //Notification
      var closureObj = {
        projectId: 0,
        projectName: ''
      }

      Option.findOne({
        attributes: ['sectionId'],
        where: {
          id: req.body.option.id
        }
      })
      .then( (section) => {
        // console.log('SECTIONOOO', section.dataValues.sectionId)
        return Section.findOne({
          attributes: ['projectId'],
          where: {
            id: section.dataValues.sectionId
          }
        })
        .then( (project) => {
          // console.log('PROJECTOOOO', project.dataValues.projectId)
          closureObj.projectId = project.dataValues.projectId;

          return Project.findOne({
            attributes: ['userId', 'name'],
            where: {
              id: project.dataValues.projectId
            }
          })
        })
        .then( (user) => {
          // console.log('USEROOOOO SOURCE', user.dataValues.userId);
          closureObj.projectName = user.dataValues.name;
          creatorId = user.dataValues.userId;
          Notifications.create({
            sourceUsername: req.session.username,
            optionId: req.body.option.id,
            optionName: req.body.option.name,
            userId: user.dataValues.userId,
            projectId: closureObj.projectId
          })
        })
      })
    })
    .then(() => {
      var optionPerViewCredit;

      Option.findOne({
        where: {
          id: req.body.option.id
        }
      })
      .then((option) => {
        optionPerViewCredit = option.creditsperview;
        let remainingCredits = option.totalcredits - option.creditsperview
        option.update({
          totalcredits: remainingCredits
        })
      })

      .then(()=> {
        User.findOne({
          where: {
            username: req.session.username
          }
        })
        .then((user) => {
          let newCredits = user.credits + optionPerViewCredit;
          user.update({
            credits:newCredits
          })
        })
      })
      
      .then(() => {
        User.findOne({
          where: {
            id: creatorId
          }
        })
        .then((user) => {
          let remainingCredits = user.totalcredits - optionPerViewCredit;
          user.update({
            credits: remainingCredits
          })
        })
      })
    })
})

router.post('/startVideo', (req, res) => {
  console.log('startVideo', req.body)
  User.findOne({
    where: {
      username: req.session.username
    }
  })
    .then(user => {
      console.log(user.dataValues);
      TesterAndOption
        .findOne({where: {optionId: req.body.option.id, userId: user.dataValues.id}})
        .then(data => {
          console.log(data);
          if (!data) {
            TesterAndOption.create({
              optionId: req.body.option.id,
              userId: user.dataValues.id,
              finished: false
            })
          }
          else {
            data.update({
              finished: false
            })
          }
        })
        // .then(arr => {
        //   console.log('arr', arr);
          // if (created) {
          //   entry[0].update({
          //     finished: false,
          //     like: null
          //   })
          // }

        // })
    })
})

router.get('/getKey', (req, res) => {
  console.log("GETTTTTTING KEYYYYY")
  sequelize.query("SELECT key FROM keys ORDER BY RANDOM() LIMIT 1", { type: sequelize.QueryTypes.SELECT})
    .then(key => {
    // We don't need spread here, since only the results will be returned for select queries
    res.send(key);
  })
})

// const Frame = sequelize.define('frame', {
//   time: Sequelize.INTEGER,
//   attention: Sequelize.DECIMAL,
//   smile: Sequelize.DECIMAL,
//   anger: Sequelize.DECIMAL,
//   contempt: Sequelize.DECIMAL,
//   disgust: Sequelize.DECIMAL,
//   fear: Sequelize.DECIMAL,
//   happiness: Sequelize.DECIMAL,
//   neutral: Sequelize.DECIMAL,
//   sadness: Sequelize.DECIMAL,
//   surprise: Sequelize.DECIMAL
// });

// const User = sequelize.define('user', {
//   username: Sequelize.STRING,
//   password: Sequelize.STRING,
//   email: Sequelize.STRING,
//   fbId: Sequelize.INTEGER,
//   sex: Sequelize.STRING,
//   age: Sequelize.INTEGER,
//   isCreator: Sequelize.BOOLEAN
// });

// router.post('/sendFrame', (req, res) => {
//   console.log(req.body);
//   let idx = 0;
//   let BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
//   base64Img.img(Object.keys(req.body)[0], 'photos', idx++, function(err, filepath) {
//     console.log('testing url', `${BASE_URL}/api/tester/photo/test`);

//     // if successfully saved photos then, make api call to azure
//     if(!err) {
//       request({
//         method: 'POST',
//         url: 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize',
//         headers: { 'Ocp-Apim-Subscription-Key': '4fc26d1500d04025a699f1ae74597ab3',
//           "Content-Type": "application/json" },
//         body: JSON.stringify({
//           url: `${BASE_URL}/api/tester/photo/${idx - 1}`,
//         })
//       })
//       .catch(err => console.log(err))
//       .then(result => {
//         result = JSON.parse(result);
//         console.log('RESPONSE: ', result);
//         res.send(JSON.stringify({result: result, photoId: (idx - 1)}));
//       })
//     } else {
//       res.send(JSON.stringify({result: 'unable to save image'}));
//     }
//   });

//   // imageDataURI.outputFile(req.body, filePath)

// })

// router.get('/photo/:id', function(req, res) {
//   console.log("sending photooooo")
//   res.sendFile(path.resolve('photos/' + req.params.id + '.png'));
// })


const aggregateComments = (option, res) => {
  TesterAndOption.findAll({
    where: {
      optionId: option.id
    }
  })
    .then((allLikes) => {
      var string = allLikes.reduce((current, next) => {
        if (next.comment !== null) {
          return current += next.comment + ' ';
        } else {
          return current;
        }
      }, '');
      if (string.length < 1350) {
        return string += string
      } else if (string.length > 1350) {
        return string;
      }
    })
    .then((toApiString) => {
      axios.post('http://api.smmry.com/&SM_API_KEY=5D5C4B6642&SM_LENGTH=2&SM_KEYWORD_COUNT=20', "sm_api_input=" + toApiString)
      .then((summary) => {
        console.log('API summary request success', summary);
        return summary.data
      })
      .then((summary) => {
        SectionComments.findOne({
          where: {
            optionId: option.id
          }
        })
          .then((existent) => {
            if (existent) {
              existent.update({
                aggregateComments: toApiString,
                summary: summary.sm_api_content // Will default to null in failure.
              })
            } else {
              SectionComments.create({
                optionId: option.id,
                aggregateComments: toApiString,
                summary: summary.sm_api_content // Will default to null in failure.
              })
            }
          })
        })
        .catch((err) => {
          console.log('Error with summary api request', err);
        })
      })
  };


module.exports = router;
