// Import relevant things from db 
const Sections = require('../../../db/models/section.js')

exports.getRelatedSection = function(req, res) {
  // send projectId, grab sections, use sectionid to grab options
  Sections.findAll({
    where: {
      projectId: req.query.projectId
    }
  })
    .then((sectionsArray) => {
      res.send(sectionsArray);
    })
    .catch((err) => {
      res.send('Error finding relevant projects!')
    })
};