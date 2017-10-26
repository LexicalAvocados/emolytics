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
      return patreonAPIClient('/current_user');
    })
    .then(({store}) => {
      let patreonUser = store.findAll('user').map(user => user.serialize());
      console.log('patreonUser[0].data:', patreonUser[0].data);
    })
    .catch(err => {
      console.error('Patreon OAuth error:', err);
      res.send(err);
    });
};