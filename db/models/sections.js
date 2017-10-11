import sequelize from 'sequelize';

const Section = sequelize.define('section', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT
});

Section.belongsTo(Project);

Section.sync({force: false});

module.exports = Section;
