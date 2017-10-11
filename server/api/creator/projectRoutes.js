const db = require('../../../db/index.js');
const Sections = db.Section;

exports.getRelatedSection = function(req, res) {
  Sections.findAll({
    where: {
      projectId: req.query.projectId
    }
  })
    .then((sectionsArray) => {
      console.log('*************', sectionsArray);
      res.send(sectionsArray);
    })
    .catch((err) => {
      console.log('**********dfdfdf***', err);
      res.send('Error finding relevant projects!');
    })
};