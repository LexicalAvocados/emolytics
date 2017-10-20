const db = require('../../../db/index.js');
const Options = db.Option;
const Likes = db.TesterAndOption;
const Users = db.User;
// const Sequelize = require('sequelize');
// const sequelize = db.sequelize;
const SectionComments = db.SectionComments;
const axios = require('axios');


exports.getRelatedOptions = (req, res) => {
  Options.findAll({
    where: {
      sectionId: req.query.sectionId
    }
  })
    .then((optionsArray) => {
      res.send(optionsArray);
    })
    .catch((err) => {
      res.send('Error retrieving options!');
    })
};

exports.getLikesOnOption = (req, res) => {
    Likes.findAll({
      where: {
        optionId: req.body.optionId
      }
    })
    .then((likes) => {
      console.log('All likes', likes)
      res.send(likes)
    })
    .catch((err) => {
      res.send('Error retrieving Like on this option/user combo!')
    })
};

exports.getUsersIdsWhoWatced = (req, res) => {
   Likes.findAll({
    attributes: ['userId'],
    where: {
      optionId: req.body.optionId
    }
  })
  .then( (usersIdsArr) => {
      res.send(JSON.stringify(usersIdsArr));
    })
  .catch((err) => console.error('err in getting userids', err))
};

exports.getUsersNamesWhoWatced = (req, res) => {
   Users.findAll({
    where: {
      id: req.body.userId
    }
  })
  .then( (userObj) => {
    res.send(JSON.stringify(userObj));
  })
  .catch((err) => console.error('err in getting usernames', err))
}

// I've sent all the options associated with that section

exports.getTestersForOption = (req, res) => {
  Likes.findAll({
    where: {
      optionId: req.query.optionId
    }
  })
    .then((options) => {
      let userIds = options.map((option) => {
        return option.userId;
      })
      res.send(userIds);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.addOption = (req, res) => {
  Options.create({
    name: req.body.name,
    description: req.body.description,
    sectionId: req.body.sectionId,
    youtubeUrl: req.body.url,
    thumbnail: req.body.thumbnail,
    length: req.body.length
    // tags: req.body.tags
  })
    .then((newOption) => {
      if (newOption) {
        res.send(newOption);
      }
    })
    .catch((err) => {
      console.error('Error creating new option', err);
    });
};

exports.aggregateComments = (req, res) => {
  option = JSON.parse(req.query.option);
  sectionId = JSON.parse(req.query.sectionId);
  Likes.findAll({
    where: {
      optionId: option.id
    }
  })
    .then((allLikes) => {
      return allLikes.reduce((current, next) => {
        if (next.comment !== null) {
          return current += next.comment + ' ';
        }
      }, '');
    })
    .then((string) => {
      SectionComments.findOne({
        where: {
          optionId: option.id,
          sectionId: sectionId
        }
      })
        .then((existent) => { // update option's entry with new comments
          if (existent) {
            existent.update({
              aggregateComments: string
            })
          } else {
            SectionComments.create({ // add entry
              sectionId: sectionId,
              optionId: option.id,
              aggregateComments: string 
            }) 
          }
        })
        .catch((err) => {
          console.log(err);
        })
    })
  };



  // axios.post('http://api.smmry.com/&SM_API_KEY=5D5C4B6642&SM_LENGTH=0&SM_KEYWORD_COUNT=5', "sm_api_input=" + JSON.stringify(string))
  // .then((response) => {
  //   console.log('RESPONSE FROM THE API', response.data);
  //   res.send(response.data);
  // })
  // .catch((err) => {
  //   console.log('ERROR SENDING COMMENT TO API', err);
  // })
