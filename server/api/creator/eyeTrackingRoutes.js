const db = require('../../../db/index.js');
const EyeTracking = db.EyeTracking;

exports.getEyeTrackingForOption = (req, res) => {
  EyeTracking.findAll({
    where: {
      optionId: req.query.optionId
    }
  })
  .then((data) => {
    res.send(JSON.stringify(data))
  })
}
