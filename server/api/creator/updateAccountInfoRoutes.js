const db = require('../../../db/index.js');
const User = db.User;
const Project = db.Project;
const Section = db.Section;
const Option = db.Option;
const sequelize = db.sequelize;

exports.updateCreatorBio = (req, res) => {
  User.findOne({
    where: {
      username: req.session.username || req.session.passport.user.username
    }
  })
  .then( (user) => {
    // console.log('user to update: ', user);
    user.update({
      profilepicture: req.body.picture,
      aboutme: req.body.aboutme,
      showcasevideo: req.body.video,
      title: req.body.title
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
    // console.log('user to update: ', user);
    user.update({
      youtubeprofile: req.body.youtubeprofile,
      twitterhandle: req.body.twitterhandle,
      website: req.body.website
    })
  })
  .then( () => {
    res.send('successfully updated user record')
  })
};

exports.getCreatorDataForPublicProfile = (req, res) => {
  var uid = req.query.uid;
  console.log('USER ID FOR PROFILE', uid)
  sequelize.query(`SELECT "users"."id", "users"."username", "users"."name", "users"."aboutme",
                  "users"."profilepicture", "users"."showcasevideo", "users"."youtubeprofile", "users"."website",
                  "users"."twitterhandle", "users"."patreonId", "users"."patreonAbout", "users"."email",
                  "users"."patreonImageUrl", "users"."patreonUrl", "users"."patreonVanity", "users"."title",
                  "patreonCampaigns"."campaignId", "patreonCampaigns"."creationName",
                  "patreonCampaigns"."isPlural", "patreonCampaigns"."pledgeUrl", "patreonCampaigns"."summary"
                  FROM "users" LEFT OUTER JOIN "patreonCampaigns"
                  ON "users"."id" = "patreonCampaigns"."userId"
                  WHERE "users"."id" = ${uid};`)
    .then(user => {
      user = user[0][0];
      var responseObj = {
        id: user.id,
        aboutme: user.aboutme || '',
        profilepicture: user.profilepicture || '',
        showcasevideo: user.showcasevideo || '',
        youtubeprofile: user.youtubeprofile || '',
        twitterhandle: user.twitterhandle || '',
        username: user.username || '',
        name: user.name || '',
        patreonId: user.patreonId || '',
        patreonAbout: user.patreonAbout || '',
        patreonImageUrl: user.patreonImageUrl || '',
        patreonUrl: user.patreonUrl || '',
        patreonVanity: user.patreonVanity || '',
        campaignId: user.campaignId || '',
        creationName: user.creationName || '',
        isPlural: user.isPlural || '',
        pledgeUrl: user.pledgeUrl || '',
        summary: user.summary || '',
        title: user.title || '',
        email: user.email || '',
        website: user.website || ''
      }
      res.send(JSON.stringify(responseObj))
    })
    .catch(err => {
      res.send(err);
    });
};

exports.getCreatorVideosForPublicProfile = (req, res) => {
  Option.findAll({
    where: {
      userId: req.query.uid
    }
  })
  .then((options) => {
    console.log('OPTIONS THAT BELONG TO CREATOR', options)
    var publicOptionsArray = options.filter(option => {
      return option.dataValues.isPublic;
    })
    res.send(JSON.stringify(publicOptionsArray))
  })
}
