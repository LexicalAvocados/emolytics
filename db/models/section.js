const Sequelize = require('sequelize');
const sequelize = require('../index.js');
const Project = require('./project.js');

const Section = sequelize.define('section', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT
});

Section.belongsTo(Project);

Section.sync({force: false});

module.exports = Section;
