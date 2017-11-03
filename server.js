const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const Bluebird = require('bluebird');
const router = require('./server/router');
const db = require('./db');
const auth = require('./server/auth');
const patreon = require('./server/auth/patreon');
const cron = require('./server/crontab.js');
// const secret = require('./key.js').sessions.secret;
const secret = process.env.SESSION_SECRET;
const axios = require('axios');

const passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy;
const User = db.User;

const app = express();
const PORT = process.env.PORT || 3000;

passport.use(new FacebookStrategy({
  clientID: '1808121682812707',
  clientSecret: '44fdbb032d8a430258e537b674992851',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'name', 'email', 'displayName', 'gender', 'likes', 'movies', 'music', 'books', 'television', 'games', 'locale', 'age_range']
},
function(accessToken, refreshToken, profile, cb) {
  console.log('profile', profile);

  var usernameInitials = profile.displayName.split(' ').reduce((acc, namepart) => {
    acc += namepart[0];
    return acc;
  }, '').toLowerCase();

  User.findOne(
    {where: { name: profile.displayName }
    })
    .then((existingUser, err) => {
      // console.log('incoming user', existingUser)
      if (!existingUser) {
        let params = ['likes', 'movies', 'music', 'books', 'television', 'games'];
        let likeObj = {};
        params.forEach((thing) => {
          if (profile._json[thing]) {
            likeObj[thing] = profile._json[thing].data.reduce((acc, curr) => {acc.push(curr.name); return acc; }, [])
          }
        });
        // console.log('likeObj', likeObj)
        User.create({
          name: profile.displayName,
          username: usernameInitials,
          sex: profile.gender,
          age: profile._json.age_range.min || 1,
          fbId: profile.id,
          location: profile._json.locale || '',
          likes: likeObj.likes || [],
          movies: likeObj.movies || [],
          music: likeObj.music || [],
          books: likeObj.books || [],
          television: likeObj.television || [],
          games: likeObj.games || []
        })
          .then( (newUser) => {
            // console.log('new user created', newUser)
            return cb(err, newUser)
          });
      } else {
        return cb(err, existingUser)
      }
    })
    .catch((err) => console.error('error in db call', err))
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(bodyParser.json({ limit: '50mb'} ));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(cookieParser());

app.use(session({
  secret,
  cookie: {
    maxAge: 60 * 60 * 24 * 1000,
    saveUninitialized: true,
    secure: !true
  }
}));

// app.use(express.static(__dirname + '/../react-client/dist'));
app.use(express.static(__dirname + '/client'));

app.use('/api', router);
app.post('/signup', (req, res) => auth.createAccount(req, res));
app.post('/login', (req, res) => auth.attemptLogin(req, res));
app.get('/logout', (req, res) => auth.logout(req, res));
app.put('/profile', (req, res) => auth.editProfile(req, res));
app.get('/oauth/patreon/signup/creator', (req, res) => patreon.handleOAuth(req, res, 'creator'));
app.get('/oauth/patreon/signup/tester', (req, res) => patreon.handleOAuth(req, res, 'tester'));
app.get('/oauth/patreon/login', (req, res) => patreon.handleOAuth(req, res, 'login'));
app.post('/patreon/patrons', (req, res) => patreon.getPatrons(req, res));
app.get('/redirect/patreon', (req, res) => patreon.getUserInfoAfterOAuth(req, res));
app.post('/patreon/webhook', (req, res) => patreon.handleWebhook(req, res));

// app.use(auth.checkUser);
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['user_likes', 'email', 'public_profile'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/loading', failureRedirect: '/login' }));

var url = 'https://api.vimeo.com/oauth/authorize?client_id=4ae97e8f0e44b16c572c11eda1db507c3ca69baf&response_type=code&redirect_uri=http://localhost:3000/auth/vimeo/callback&state=string';

app.get('/auth/vimeo', (req, res) => {
  res.redirect(url)
})

var base64url = 'NGFlOTdlOGYwZTQ0YjE2YzU3MmMxMWVkYTFkYjUwN2MzY2E2OWJhZjpTd0M0K29HR2hLcVJ4RE0yODFqRjErQ1BZR3JTMGdSV1ZWZjV1WER6YVVIelEyajFqM3p3dDNEV2xoTkdHSkx5N0EvOUxUWTBEMVMwMEpiMHJYa0tqN2JFZ0daNmFpSmwvQ3IzclcralNwYmlTZDZYdWhqRUw4NTNOLzBsQkRBeQ=='

var config = {
  headers: {
    "Authorization" : `basic ${base64url}`
  }
}

  app.get('/auth/vimeo/callback', (req, res) => {
    console.log('URL', req.originalUrl)
    console.log('STATE', req.query.state)
    console.log('CODE', req.query.code)
    axios.post('https://api.vimeo.com/oauth/access_token', {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: 'http://localhost:3000/auth/vimeo/callback'
    }, config)
    .then((response) => {
      // console.log('RESPONSE FROM VIMEO ACCESS TOKEN', response.data.access_token)
      var vimUser = response.data.user;
      var videosEndpoint = vimUser.metadata.connections.shared;
      var accessToken = response.data.access_token;
      // console.log('VIDEOS ENDPOINT', videosEndpoint)

      var configForUser = {
        'Authorization' : `Bearer ${accessToken}`
      }
      
      // axios.get(`https://api.vimeo.com${videosEndpoint}`, configForUser)
      // .then((data) => {
      //   console.log('RESPONSE FROM USER VIMEO VIDEOS', data)
      // })
      // .catch((err) => {
      //   console.log('ERROR WITH VIMEO ACCESS', err)
      // })
      return User.findOne({
        where:{ username: vimUser.name}
      })
      .then((user) => {
        if (!user) {
          return User.create({
            username: vimUser.name,
            name: vimUser.name,
            location: vimUser.location
          })
        } else {
          return user;
        }
      })
      .then((actualUser) => {
        req.session.username = actualUser.username;
        req.session.save();
        // console.log('ACTUAL USER', actualUser)
        // console.log('RES', res)
        res.redirect('/vimeoloading');
      })
    })
    .catch((err) => {
      console.log('vimeo error', err)
    })
  });

app.get('/userdata', (req, res) => {
  res.send(JSON.stringify(req.session));
});

app.get('/vimeouserdata', (req, res) => {
  // console.log('REQUEST FROM VIMEO USER', req)
  res.send(JSON.stringify(req.session));
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
