const db = require('../../../db/index.js');
const Tryer = db.Tryer;
const TryerFrame = db.TryerFrame;

exports.createTryer = (req, res) => {
  Tryer.create({})
    .then( (tryer) => {
      res.send(JSON.stringify(tryer));
    });
};

// exports.sendTryerFrame = (req, res) => {
//
//   var emotions = req.body.emotions;
//
//   if (emotions) {
//
//     TryerFrame.findOne({where: {tryerId: req.body.tryerId, userArr[0].dataValues.id, time: req.body.time}})
//       .then(frame => {
//         if (frame) {
//           frame.update ({
//             attention : 1,
//             anger: emotions.anger,
//             contempt: emotions.contempt,
//             disgust: emotions.disgust,
//             fear: emotions.fear,
//             happiness: emotions.happiness,
//             neutral: emotions.neutral / 3,
//             sadness: emotions.sadness,
//             surprise: emotions.surprise,
//           })
//             .then(entry => {
//               res.send(entry);
//             })
//         } else {
//           Frame.create({
//             attention : 1,
//             time: req.body.time,
//             anger: emotions.anger,
//             contempt: emotions.contempt,
//             disgust: emotions.disgust,
//             fear: emotions.fear,
//             happiness: emotions.happiness,
//             neutral: emotions.neutral / 3,
//             sadness: emotions.sadness,
//             surprise: emotions.surprise,
//             userId: user[0].dataValues.id,
//             optionId: req.body.option.id
//           })
//             .then(entry => {
//               res.send(entry);
//             })
//           }
//         })
//   } else {
//     Frame.findOne({where: {optionId: req.body.option.id, userId: userArr[0].dataValues.id, time: req.body.time}})
//       .then(frame => {
//         if (frame) {
//           frame.update ({
//             attention : 0,
//             anger: 0,
//             contempt: 0,
//             disgust: 0,
//             fear: 0,
//             happiness: 0,
//             neutral: 0,
//             sadness: 0,
//             surprise: 0,
//           })
//             .then(entry => {
//               res.send(entry);
//             })
//         } else {
//           Frame.create({
//             attention : 0,
//             time: req.body.time,
//             anger: 0,
//             contempt: 0,
//             disgust: 0,
//             fear: 0,
//             happiness: 0,
//             neutral: 0,
//             sadness: 0,
//             surprise: 0,
//             userId: user[0].dataValues.id,
//             optionId: req.body.option.id
//           })
//             .then(entry => {
//               res.send(entry);
//           })
//         }
//       })
//   }
// }
