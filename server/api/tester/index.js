const express = require('express');
const db = require('../../../db');
const Option = db.Option;
const User = db.User;
const Frame = db.Frame;
const TesterAndOption = db.TesterAndOption;
const router = express.Router();
const base64Img = require('base64-img');
const request = require('request-promise-native');
const imageDataURI = require('image-data-uri');
const path = require('path');


// Option.create({
// 	name: 'Test Video',
// 	description: 'Video used to test users for playing youtube video',
// 	youtubeUrl: 'https://www.youtube.com/watch?v=8A3R_xz7nJQ&list=LL_uyk3EWD4JyUBgDCCfLLTQ&index=26',
// 	thumbnail: 'asdf',
// 	length: 100
// })

router.post('/getVideo', (req, res) => {
  console.log("TESTTTTTTINGGGGG")
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
	console.log(req.body);
  var emotions = req.body.emotions;
	console.log(req.session);
	User.findAll({
		where: {
			username: req.session.username
		}
	})
	 .then(user => {
    console.log(user);
    Frame.create({
      time: req.body.time,
      anger: emotions.anger,
      contempt: emotions.contempt,
      disgust: emotions.disgust,
      fear: emotions.fear,
      happiness: emotions.happiness,
      neutral: emotions.neutral,
      sadness: emotions.sadness,
      surprise: emotions.surprise,
      userId: user[0].dataValues.id,
      optionId: 1
    })
    .then(user => {
      res.send(user);
    })
   })
})

router.post('/likeVideo', (req, res) => {
  console.log(req.body);
  console.log(req.session)
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
            like: req.body.like
          })
          console.log(created);
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

module.exports = router;