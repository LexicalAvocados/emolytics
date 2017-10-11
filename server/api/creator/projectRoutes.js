// Import relevant things from db 
const sections = require('../../../db/models/section.js')

exports.getRelatedSection = function(req, res) {
  // send projectId, grab sections, use sectionid to grab options
  console.log(req.query);
  res.send('here we are');
};