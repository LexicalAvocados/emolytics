const db = require('../../../db/index.js');
const User = db.User;

exports.updateCreatorBio = (req, res) => {
  User.findOne({
    where: {
      username: req.session.username || req.session.passport.user.username
    }
  })
  .then( (user) => {
    console.log('user to update: ', user);
    user.update({
      profilepicture: req.body.picture,
      aboutme: req.body.aboutme,
      showcasevideo: req.body.video
    })
  })
  .then( () => {
    res.send('successfully updated user record')
  })
};

exports.updateCreatorSocial = (req, res) => {
  User.findOne({
    where: {
      username: req.session.username || req.session.passport.user.username
    }
  })
  .then( (user) => {
    console.log('user to update: ', user);
    user.update({
      youtubeprofile: req.body.youtubeprofile,
      twitterhandle: req.body.twitterhandle,
    })
  })
  .then( () => {
    res.send('successfully updated user record')
  })
};

exports.getCreatorDataForPublicProfile = (req, res) => {
  var uid = req.query.uid;
  console.log('USER ID FOR PROFILE', uid)
  User.findOne({
    where: {
      id: uid
    }
  })
  .then( (user) => {
    var responseObj = {
      aboutme: user.aboutme || '',
      profilepicture: user.profilepicture || '',
      showcasevideo: user.showcasevideo || '',
      youtubeprofile: user.youtubeprofile || '',
      twitterhandle: user.twitterhandle || '',
      username: user.username || '',
      name: user.name || ''
    }
    res.send(JSON.stringify(responseObj))
  })
}
