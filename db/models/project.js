import Sequelize from 'sequelize';
import sequelize from '../../db';

const Project = sequelize.define('project', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT
});

Project.belongsTo(User);

Project.sync({force: false});

module.exports = Project;
