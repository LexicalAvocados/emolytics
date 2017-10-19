const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const Bluebird = require('bluebird');
const router = require('./server/router');
const db = require('./db');
const auth = require('./server/auth');

const passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy;
const User = db.User;

const app = express();
const PORT = process.env.PORT || 3000;

passport.use(new FacebookStrategy({
    clientID: '1808121682812707',
    clientSecret: '44fdbb032d8a430258e537b674992851',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    return User.findOrCreate( {where: { name: profile.displayName, username: profile.displayName}})
    .then((user, err) => {
      console.log('incoming user', user)
      return cb(err, user[0])
    })
    .catch((err) => console.error('error in db call', err))
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

app.use(cookieParser());

app.use(session({
  secret: 'machine learning',
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

// app.use(auth.checkUser);
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook',
  passport.authenticate('facebook'));
//, { scope: ['user_likes', 'email', 'public_profile'] }
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {successRedirect: '/', failureRedirect: '/login' }));

app.get('/userdata', (req, res) => {
  res.send(JSON.stringify(req.session))
})

app.get('*', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
