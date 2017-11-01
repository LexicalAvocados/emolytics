const express = require('express');
const db = require('../../../db');
const Sequelize = require('sequelize');
const sequelize = db.sequelize;
const TesterAndOption = db.TesterAndOption;
const router = express.Router();



router.post('/getOptionsData', (req, res) => {
  // console.log('req.body',req.body);
  // var test = [];
  // req.body.forEach(elem => {
  //   TesterAndOption.findAll({where: {optionId: elem.id}})
  //     .then(data => {
  //       console.log(data);
  //       test.push(data);
  //       return data;
  //     })
  // })

  // Promise.all(test)
  //   .then(values => {
  //     console.log('VALUESSSSS');
  //     console.log(values)
  //   })
  let promises = req.body.map(elem => {
    return TesterAndOption.findAll({where: {optionId: elem.id}})
    // sequelize.query(`"SELECT * FROM "testerAndOptions" INNER JOIN "users" ON "testerAndOptions"."userId" = "users"."id" WHERE "testerAndOptions"."optionId" = "${elem.id}"`)
      .then(arr => {
        // console.log("THIS IS ARR", arr);
        let total = 0;
        let finished = 0;
        let liked = 0;
        arr.forEach(elem => {
          // console.log('ELEM', elem)
          if (elem.dataValues.finished !== null) {
            total++;
          }
          if (elem.dataValues.finished === true) {
            finished++;
          }
          if (elem.dataValues.like === true) {
            liked++;
          }
        });
        var result = {
          total: total,
          finished: finished,
          liked: liked
        };
        return result;
      });
  });
  Promise.all(promises)
    .then(values => {
      // console.log('HEREEE ARE THE VALUES', values);
      res.send(values);
    });

});



module.exports = router;