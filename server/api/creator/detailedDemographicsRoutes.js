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
    });
};

exports.generateAgeRangeObjForUserIdsArray = (req, res) => {
  var userIdsArray = req.body.userIdsArray;
  // console.log('userIdsArray', userIdsArray)
  return Promise.all(userIdsArray.map((uid) => getUserAgeRangeFunc(uid)))
  .then((arr) => {
    // console.log('User age range arr', arr)
    //convert age range indices to object with keys as age range and values as count
    var responseObj = arr.reduce((acc, curr) => {
      if(curr === 0) acc['13-20'] ? acc['13-20']+=1 : acc['13-20'] = 1;
      if(curr === 1) acc['21-30'] ? acc['21-30']+=1 : acc['21-30'] = 1;
      if(curr === 2) acc['31-40'] ? acc['31-40']+=1 : acc['31-40'] = 1;
      if(curr === 3) acc['41-50'] ? acc['41-50']+=1 : acc['41-50'] = 1;
      if(curr === 4) acc['51-60'] ? acc['51-60']+=1 : acc['51-60'] = 1;
      if(curr === 5) acc['61-70'] ? acc['61-70']+=1 : acc['61-70'] = 1;
      if(curr === 6) acc['71-80'] ? acc['71-80']+=1 : acc['71-80'] = 1;
      if(curr === 7) acc['81-90'] ? acc['81-90']+=1 : acc['81-90'] = 1;
      if(curr === 8) acc['91-100'] ? acc['91-100']+=1 : acc['91-100'] = 1;
      else {}
      return acc;
    }, {})
    console.log('RESPONSE OBJ', responseObj)
    res.send(JSON.stringify(responseObj))
  })
}

const getUserAgeRangeFunc = (uid) => {
  let ageRange = [13, 20, 21, 30, 31, 40, 41, 50, 51, 60, 61, 70, 71, 80, 81, 90, 91, 100];
  // [13-20, 21-30, 31-40, 41-50, 51-60, 61-70, 71-80]
  return Users.findOne({
    attributes: ['age'],
    where: {id: uid}
  })
  .then( (userObj) => {
    // console.log('USEROBJ', userObj)
    age = +userObj.dataValues.age;
    let ageIndForRes;
    for (let i = 0; i < ageRange.length - 1; i+=2) {
      if (ageRange[i] <= age && age <= ageRange[i+1]) {
        ageIndForRes = i/2;
      }
    }
    return ageIndForRes;
  });
};
