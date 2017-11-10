const url = require('url');
const axios = require('axios');
const sequelize = require('../../db').sequelize;
const User = require('../../db').User;
const PatreonCampaign = require('../../db').PatreonCampaign;
const patreon = require('patreon');
const patreonAPI = patreon.patreon;
const patreonOAuth = patreon.oauth;

const oauthClient = patreonOAuth(process.env.PATREON_CLIENTID, process.env.PATREON_CLIENTSECRET);

exports.handleOAuth = (req, res, mode) => {
  console.log('req.url:', req.url);
  let hasExistingAccount;
  let hasCampaign = true;
  let initialPatreonLogin;

  let redirectUri;
  if (mode === 'login') redirectUri = 'http://localhost:3000/oauth/patreon/login';
  if (mode === 'creator') redirectUri = 'http://localhost:3000/oauth/patreon/signup/creator';
  if (mode === 'tester') redirectUri = 'http://localhost:3000/oauth/patreon/signup/tester';

  const oauthGrantCode = url.parse(req.url, true).query.code;

  let patreonAPIClient;

  console.log('oauthGrantCode:', oauthGrantCode);

  oauthClient.getTokens(oauthGrantCode, redirectUri)
    .then(tokensResponse => {
      patreonAPIClient = patreonAPI(tokensResponse.access_token);
      req.session.patreonAccessToken = tokensResponse.access_token;
      return patreonAPIClient('/current_user/campaigns/');
    })
    .catch(noCampaignFound => {
      console.log('inside intermediary catch');
      hasCampaign = false;
      return patreonAPIClient('/current_user/');
    })
    .then(({store}) => {
      console.log('data store received from patreon:', store.graph);
      let patreonAccount = store.graph.user[Object.keys(store.graph.user)[0]];
      if (hasCampaign) var patreonCampaign = store.graph.campaign[Object.keys(store.graph.campaign)[0]];

      return User.findOne({
        where: {
          email: patreonAccount.email
        }
      })
        .then(existingAccount => {
          let dbInsertArgs = [
            (!!existingAccount ? existingAccount : null),
            patreonAccount,
            mode,
            (hasCampaign ? patreonCampaign : null)
          ];
          if (existingAccount) {
            hasExistingAccount = true;
            if (existingAccount.dataValues.patreonId) {
              initialPatreonLogin = false;
            }
            return mergePatreonInfoWithExistingUser(...dbInsertArgs);
          } else {
            hasExistingAccount = false;
            return createNewAccountWithPatreonInfo(...dbInsertArgs);
          }
        })
        .catch(err => {
          console.log('Error querying User table with Patreon email:', err);
        });
    })
    .then(user => {
      req.session.username = user.username;
      let queryMode = (mode === 'login' ? 'login' : (mode === 'creator' ? 'creator' : 'tester'));
      console.log('queryMode right before redirect:', queryMode);
      res.redirect(
        `/loading/patreon?type=${queryMode}
                         &existing=${hasExistingAccount}`
                         // &campaign=${hasCampaign}
                         // &initial=${initialPatreonLogin}
      );
    })
    .catch(err => {
      console.error('Patreon OAuth error:', err);
      res.send(err);
    });
};

exports.getUserInfoAfterOAuth = (req, res) => {
  sequelize.query(`SELECT "users"."id", "users"."username", "users"."name", "users"."age",
                  "users"."sex", "users"."race", "users"."isCreator", "users"."credits",
                  "users"."patreonId", "patreonCampaigns"."campaignId",
                  "users"."patreonAbout", "users"."patreonVanity", "patreonCampaigns"."creationName",
                  "patreonCampaigns"."isPlural", "patreonCampaigns"."mainVideoUrl", "patreonCampaigns"."patronCount",
                  "patreonCampaigns"."pledgeUrl", "patreonCampaigns"."publishedAt", "patreonCampaigns"."summary"
                  FROM "users" LEFT OUTER JOIN "patreonCampaigns"
                  ON "users"."id" = "patreonCampaigns"."userId"
                  WHERE "users"."username" = '${req.session.username}';`)
    .then(user => {
      // user should look like this: [[{userObj}], {metadata}]
      res.send({
        loggedIn: true,
        userData: user[0][0]
      });
    })
    .catch(err => {
      console.log('Sequelize error:', err);
      res.send(err);
    });
};

exports.getPatrons = (req, res) => {
  let patreonAPIClient = patreonAPI(req.session.patreonAccessToken);
  patreonAPIClient(`/campaigns/${req.body.campaignId}/pledges`)
    .then(({store}) => {
      // store.graph should look like this:
      // { user: { 'creatorId': { userObj }, 'patronId': { userObj }, 'patronId': { userObj } }
      console.log('Users data received from Patreon:', store.graph.user);
      let users = store.graph.user;
      let patrons = [];
      // for (var id in users) {
      return Promise.all(Object.keys(users).filter(id => Number(id) !== req.body.patreonId).map(id => {
        return User.findOne({
          where: {
            email: users[id].email
          }
        })
          .then(patronAcct => {
            if (patronAcct) {
              return patronAcct;
            } else {
              return ({
                patreonId: id,
                email: users[id].email,
                fullName: users[id].full_name
              });
            }
          })
          .catch(err => {
            console.log('Error querying DB for Patron:', err);
          });
      }));
    })
    .then(patrons => {
      res.send(patrons);
    })
    .catch(err => {
      console.log('Error fetching Patron data from Patreon:', err);
      res.send(err);
    });
};

const mergePatreonInfoWithExistingUser = (existing, patreon, mode, campaign) => {
  return existing.update(
    {
      lastloggedin: new Date(),
      patreonId: patreon.id,
      patreonAbout: patreon.about,
      patreonCreatedAt: patreon.created,
      patreonEmail: patreon.email,
      patreonImageUrl: patreon.image_url,
      patreonUrl: patreon.url,
      patreonVanity: patreon.vanity
    },
    {
      returning: true
    }
  )
    .then(user => {
      if (user.isCreator) {
        PatreonCampaign.create({
          campaignId: campaign.id,
          creationCount: campaign.creation_count,
          creationName: campaign.creation_name,
          displayPatronGoals: campaign.display_patron_goals,
          earningsVisibility: campaign.earnings_visibility,
          isChargedImmediately: campaign.is_charged_immediately,
          isMonthly: campaign.is_monthly,
          isNsfw: campaign.is_nsfw,
          isPlural: campaign.is_plural,
          mainVideoUrl: campaign.main_video_url,
          patronCount: campaign.patron_count,
          payPerName: campaign.pay_per_name,
          pledgeSum: campaign.pledge_sum,
          pledgeUrl: campaign.pledge_url,
          publishedAt: campaign.published_at,
          summary: campaign.summary,
          thanksMsg: campaign.thanks_msg,
          thanksVideoUrl: campaign.thanks_video_url,
          userId: user.id
        });
      }
      return user;
    })
    .catch(err => {
      console.log('Error merging Patreon into DB:', err);
    });
};

const createNewAccountWithPatreonInfo = (existing = null, patreon, mode, campaign) => {
  return User.create({
    username: patreon.vanity,
    email: patreon.email,
    name: patreon.full_name,
    isCreator: true,
    lastloggedin: new Date(),
    patreonId: patreon.id,
    patreonAbout: patreon.about,
    patreonCreatedAt: patreon.created,
    patreonEmail: patreon.email,
    patreonImageUrl: patreon.image_url,
    patreonUrl: patreon.url,
    patreonVanity: patreon.vanity
  })
    .then(newUser => {
      if (newUser.isCreator) {
        PatreonCampaign.create({
          campaignId: campaign.id,
          creationCount: campaign.creation_count,
          creationName: campaign.creation_name,
          displayPatronGoals: campaign.display_patron_goals,
          earningsVisibility: campaign.earnings_visibility,
          isChargedImmediately: campaign.is_charged_immediately,
          isMonthly: campaign.is_monthly,
          isNsfw: campaign.is_nsfw,
          isPlural: campaign.is_plural,
          mainVideoUrl: campaign.main_video_url,
          patronCount: campaign.patron_count,
          payPerName: campaign.pay_per_name,
          pledgeSum: campaign.pledge_sum,
          pledgeUrl: campaign.pledge_url,
          publishedAt: campaign.published_at,
          summary: campaign.summary,
          thanksMsg: campaign.thanks_msg,
          thanksVideoUrl: campaign.thanks_video_url,
          userId: newUser.id
        });
      }
      return newUser;
    })
    .catch(err => {
      console.log('Error creating new DB entries with Patreon data:', err);
    });
};

// PATREON API '/current_user/campaigns/'' RESPONSE DATA EXAMPLE
//
//{ user:
//  { '8111948':
//     JsonApiDataStoreModel {
//       id: '8111948',
//       _type: 'user',
//       _attributes: [Array],
//       _relationships: [Array],
//       about: 'Reaction Sync',
//       created: '2017-10-18T15:51:31+00:00',
//       discord_id: null,
//       email: 'cyghfer@gmail.com',
//       facebook: null,
//       facebook_id: null,
//       first_name: 'Reaction',
//       full_name: 'Reaction Sync',
//       gender: 0,
//       has_password: true,
//       image_url: 'https://c10.patreonusercontent.com/3/eyJ3Ijo0MDB9/patreon-user/CWFe1XFNj7M8MPyQnMSt_KRBHI8dUBJD99nXgug3yWy_z7Omjj9waNjZFajH0YwY.jpg?token-time=2145916800&token-hash=gVBPys5WGM6PhcaPO-heNNM1g1fcbxndB4uhHFcAJbI%3D',
//       is_deleted: false,
//       is_email_verified: false,
//       is_nuked: false,
//       is_suspended: false,
//       last_name: 'Sync',
//       social_connections: [Object],
//       thumb_url: 'https://c10.patreonusercontent.com/3/eyJoIjoxMDAsInciOjEwMH0%3D/patreon-user/CWFe1XFNj7M8MPyQnMSt_KRBHI8dUBJD99nXgug3yWy_z7Omjj9waNjZFajH0YwY.jpg?token-time=2145916800&token-hash=hmEF_iT9j9tFKaD6EdaeqE6JB3As0nePKJTDj2w1gTM%3D',
//       twitch: null,
//       twitter: null,
//       url: 'https://www.patreon.com/reactionsync',
//       vanity: 'reactionsync',
//       youtube: null,
//       campaign: [Object] } },
// campaign:
//  { '1295959':
//     JsonApiDataStoreModel {
//       id: '1295959',
//       _type: 'campaign',
//       _attributes: [Array],
//       _relationships: [Array],
//       created_at: '2017-10-26T15:04:34+00:00',
//       creation_count: 1,
//       creation_name: 'Reaction Sync - An Application to Sync Your Reactions',
//       discord_server_id: null,
//       display_patron_goals: true,
//       earnings_visibility: 'public',
//       image_small_url: null,
//       image_url: null,
//       is_charged_immediately: false,
//       is_monthly: false,
//       is_nsfw: false,
//       is_plural: false,
//       main_video_embed: '\n      <iframe allowfullscreen="" frameborder="0" height="480" scrolling="no" src="https://www.youtube.com/embed/7DYGwlGKICo" width="854"></iframe>\n    ',
//       main_video_url: 'https://www.youtube.com/watch?v=7DYGwlGKICo',
//       one_liner: null,
//       outstanding_payment_amount_cents: 0,
//       patron_count: 2,
//       pay_per_name: 'Magnum Opus',
//       pledge_sum: 180,
//       pledge_url: '/bePatron?c=1295959',
//       published_at: '2017-10-26T15:06:58+00:00',
//       summary: 'I came to Patreon to create amazing educational content.',
//       thanks_embed: '\n      <iframe allowfullscreen="" frameborder="0" height="480" scrolling="no" src="https://www.youtube.com/embed/VisS7_ROmYw" width="854"></iframe>\n    ',
//       thanks_msg: 'yo thanks homie this pledge really helps me out.',
//       thanks_video_url: 'https://www.youtube.com/watch?v=VisS7_ROmYw',
//       creator: [Object],
//       goals: [],
//       rewards: [Array] } },
// reward:
//  { '0':
//     JsonApiDataStoreModel {
//       id: '0',
//       _type: 'reward',
//       _attributes: [Array],
//       _relationships: [Array],
//       amount: 1,
//       amount_cents: 1,
//       created_at: null,
//       description: 'Patrons Only',
//       remaining: 0,
//       requires_shipping: false,
//       url: null,
//       user_limit: null,
//       creator: [Object] },
//    '2105810':
//     JsonApiDataStoreModel {
//       id: '2105810',
//       _type: 'reward',
//       _attributes: [Array],
//       _relationships: [Array],
//       amount: 500,
//       amount_cents: 500,
//       created_at: '2017-10-26T23:45:38.712832+00:00',
//       description: 'Now U Know About Redux',
//       discord_role_ids: null,
//       edited_at: '2017-10-26T23:45:38.712832+00:00',
//       image_url: 'https://c10.patreonusercontent.com/3/eyJwIjoxLCJ2IjoiMSJ9/patreon-media/reward/2105810/9bf7f6d4872f45e9926c60b302cc2255?token-time=1511568000&token-hash=JebDqFSTZhE84bYdi__m4MCdIHJ4dUpGlXoFpJMBn-4%3D',
//       patron_count: 0,
//       post_count: null,
//       published: true,
//       published_at: '2017-10-26T23:45:38.712832+00:00',
//       remaining: 5,
//       requires_shipping: false,
//       title: 'Patricians',
//       unpublished_at: null,
//       url: '/bePatron?c=1295959&rid=2105810',
//       user_limit: 5,
//       campaign: [Object],
//       creator: [Object] },
//    '-1':
//     JsonApiDataStoreModel {
//       id: '-1',
//       _type: 'reward',
//       _attributes: [Array],
//       _relationships: [Array],
//       amount: 0,
//       amount_cents: 0,
//       created_at: null,
//       description: 'Everyone',
//       remaining: 0,
//       requires_shipping: false,
//       url: null,
//       user_limit: null,
//       creator: [Object] } } }
