const Sequelize = require('sequelize');

console.log('testing');

const sequelize = new Sequelize('reactionsync', 'pengcheng95', 'passwordmajing', {
  host: 'reaction.csm1qfcrhywi.us-east-2.rds.amazonaws.com',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

sequelize
.authenticate()
.then(() => {
console.log('Connection has been established successfully with reactionsync');
})
.catch(err => {
console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
