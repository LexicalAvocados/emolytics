const url = require('url');
const axios = require('axios');
const User = require('../../db').User;
const keys = require('../../key.js');
const patreon = require('patreon');
const patreonAPI = patreon.patreon;

const clientId = keys.patreon.clientId;
const clientSecret = keys.patreon.clientSecret;
const oauthClient = patreon.oauth(clientId, clientSecret);

exports.handleOAuthRedirect = (req, res) => {
  const oauthGrantCode = url.parse(req.url, true).query.code;

  oauthClient.getTokens(oauthGrantCode, 'http://localhost:3000/oauth/patreon')
    .then(tokensResponse => {
      const patreonAPIClient = patreonAPI(tokensResponse.access_token);
      return patreonAPIClient('/current_user/campaigns');
    })
    .then(({store}) => {
      let patreonUser = store.graph.user[Object.keys(store.graph.user)[0]];
      let patreonUserCampaign = store.graph.campaign[Object.keys(store.graph.campaign)[0]];
      console.log('patreonUser:', patreonUser);
      console.log('patreonUserCampaign:', patreonUserCampaign);
      
      // User.findOne({
      //   where: {
      //     email: patreonAccount.user.email
      //   }
      // })
    })
    .catch(err => {
      console.error('Patreon OAuth error:', err);
      res.send(err);
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
