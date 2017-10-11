const Sequelize = require('sequelize');
const sequelize = require('../index.js');
const Section = require('./section.js');

const Option = sequelize.define('option', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  youtubeUrl: Sequelize.TEXT,
  thumbnail: Sequelize.TEXT,
  length: Sequelize.INTEGER
});

Option.belongsTo(Section);

Option.sync({force: false});

module.exports = Option;
