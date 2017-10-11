import Sequelize from 'sequelize';
// import sequelize from '../../db';
const sequelize = require('../../db');

const Section = sequelize.define('section', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT
});

Section.belongsTo(Project);

Section.sync({force: false});

module.exports = Section;
