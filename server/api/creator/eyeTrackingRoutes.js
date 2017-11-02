const db = require('../../../db/index.js');
const EyeTracking = db.EyeTracking;

exports.getEyeTrackingForOption = (req, res) => {
  let eyeTrackingData;
  if (req.body.userId) {
    eyeTrackingData = EyeTracking.findAll({
      where: {
        optionId: req.query.optionId,
        userId: req.query.userId
      }
    })
  } else {
    eyeTrackingData = EyeTracking.findAll({
      where: {
        optionId: req.query.optionId
      }
    })
  }

  eyeTrackingData
    .then(data => {
      res.send(JSON.stringify(data));
    })
    .catch(err => {
      console.log('Error getting eye tracking data:', err);
      res.send(err);
    });
};