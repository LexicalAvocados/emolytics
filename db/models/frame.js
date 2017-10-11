import Sequelize from 'sequelize';
import sequelize from '../../db';

const Frame = sequelize.define('frame', {
  time: Sequelize.INTEGER,
  attention: Sequelize.DECIMAL,
  smile: Sequelize.DECIMAL,
  anger: Sequelize.DECIMAL,
  contempt: Sequelize.DECIMAL,
  disgust: Sequelize.DECIMAL,
  fear: Sequelize.DECIMAL,
  happiness: Sequelize.DECIMAL,
  neutral: Sequelize.DECIMAL,
  sadness: Sequelize.DECIMAL,
  surprise: Sequelize.DECIMAL
});

Frame.belongsTo(User);

Frame.belongsTo(Option);

Frame.sync({force: false});

module.exports = Frame;
