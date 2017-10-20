const db = require('../../../db/index.js');
const Users = db.User;
const Options = db.Option;
const Likes = db.TesterAndOption;

exports.getUserAgeRange = (req, res) => {
  let user = req.query.uid;
  let ageRange = [13, 20, 21, 30, 31, 40, 41, 50, 51, 60, 61, 70, 71, 80, 81, 90, 91, 100];
  // [13-20, 21-30, 31-40, 41-50, 51-60, 61-70, 71-80]
  Users.findOne({
    attributes: ['age'],
    where: {id: user}
  })
  .then( (userObj) => {
    age = +userObj.dataValues.age;
    let ageIndForRes;
    for (let i = 0; i < ageRange.length - 1; i+=2) {
      if (ageRange[i] <= age && age <= ageRange[i+1]) {
        ageIndForRes = i/2;
      }
    }
    res.send(JSON.stringify(ageIndForRes));
  })
};
