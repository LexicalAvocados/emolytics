// Import relevant things from db 
const Options = require('../../../db/models/option.js');
//getOptionsForSection
exports.getRelatedOptions = function(req, res) {
  res.send('Oh my!');
  // Query options with sectionId, send them all back
  Options.findAll({
    where: {
      sectionId: req.query.sectionId
    }
  })
    .then((optionsArray) => {
      res.send(optionsArray);
    })
    .catch((err) => {
      res.send('Error retrieving options!')
    })
};