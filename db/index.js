const Sequelize = require('sequelize');

const sequelize = new Sequelize('reactionsync', 'pengcheng95', 'passwordmajing', {
  host: 'reaction.csm1qfcrhywi.us-east-2.rds.amazonaws.com',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully with reactionsync');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// ~~~~~~~~~~~ //
// User Schema //
// ~~~~~~~~~~~ //

const User = sequelize.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  fbId: Sequelize.STRING,
  name: Sequelize.STRING,
  sex: Sequelize.STRING,
  age: Sequelize.INTEGER,
  race: Sequelize.STRING,
  isCreator: {type: Sequelize.BOOLEAN, defaultValue: false},
  likes: Sequelize.ARRAY(Sequelize.TEXT),
  movies: Sequelize.ARRAY(Sequelize.TEXT),
  music: Sequelize.ARRAY(Sequelize.TEXT),
  books: Sequelize.ARRAY(Sequelize.TEXT),
  television: Sequelize.ARRAY(Sequelize.TEXT),
  games: Sequelize.ARRAY(Sequelize.TEXT),
  location: Sequelize.STRING,
  lastloggedin: Sequelize.DATE,
  credits: {type: Sequelize.INTEGER, defaultValue: 0},
  patreonId: Sequelize.INTEGER,
  patreonAbout: Sequelize.STRING,
  patreonCreatedAt: Sequelize.DATE,
  patreonEmail: Sequelize.STRING,
  patreonImageUrl: Sequelize.STRING,
  patreonUrl: Sequelize.STRING,
  patreonVanity: Sequelize.STRING,
  profilepicture: Sequelize.STRING,
  aboutme: Sequelize.STRING,
  showcasevideo: Sequelize.STRING,
  youtubeprofile: Sequelize.STRING,
  twitterhandle: Sequelize.STRING
});

User.sync({force: false});

// ~~~~~~~~~~~~~~~~~~~~~~~ //
// Patreon Campaign Schema //
// ~~~~~~~~~~~~~~~~~~~~~~~ //

const PatreonCampaign = sequelize.define('patreonCampaign', {
  campaignId: Sequelize.INTEGER,
  creationCount: Sequelize.INTEGER,
  creationName: Sequelize.STRING,
  displayPatronGoals: Sequelize.BOOLEAN,
  earningsVisibility: Sequelize.STRING,
  isChargedImmediately: Sequelize.BOOLEAN,
  isMonthly: Sequelize.BOOLEAN,
  isNsfw: Sequelize.BOOLEAN,
  isPlural: Sequelize.BOOLEAN,
  mainVideoUrl: Sequelize.STRING,
  patronCount: Sequelize.INTEGER,
  payPerName: Sequelize.STRING,
  pledgeSum: Sequelize.INTEGER,
  pledgeUrl: Sequelize.STRING,
  publishedAt: Sequelize.DATE,
  summary: Sequelize.STRING,
  thanksMsg: Sequelize.STRING,
  thanksVideoUrl: Sequelize.STRING
});

PatreonCampaign.belongsTo(User);

PatreonCampaign.sync({force: false});

// ~~~~~~~~~~~~~~~~~~ //
// Focus Group Schema //
// ~~~~~~~~~~~~~~~~~~ //

const FocusGroup = sequelize.define('focusGroup', {
  name: Sequelize.STRING,
});

FocusGroup.belongsTo(User);
FocusGroup.belongsTo(PatreonCampaign);

FocusGroup.sync({force: false});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// Focus Group / Tester Schema //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

const FocusGroupAndTester = sequelize.define('focusGroupAndTester', {
});

FocusGroup.belongsToMany(User, {through: 'focusGroupAndTester'});
User.belongsToMany(FocusGroup, {through: 'focusGroupAndTester'});

FocusGroupAndTester.sync({force: false});

// ~~~~~~~~~~~~~~ //
// Project Schema //
// ~~~~~~~~~~~~~~ //

const Project = sequelize.define('project', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  deleted: {type: Sequelize.BOOLEAN, defaultValue: false}
});

Project.belongsTo(User);

Project.sync({force: false});

// ~~~~~~~~~~~~~~ //
// Section Schema //
// ~~~~~~~~~~~~~~ //

const Section = sequelize.define('section', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  deleted: {type: Sequelize.BOOLEAN, defaultValue: false}
});

Section.belongsTo(Project);

Section.sync({force: false});

// ~~~~~~~~~~~~~ //
// Option Schema //
// ~~~~~~~~~~~~~ //

const Option = sequelize.define('option', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  youtubeUrl: Sequelize.TEXT,
  thumbnail: Sequelize.TEXT,
  length: Sequelize.INTEGER,
  totalcredits: {type: Sequelize.INTEGER, defaultValue: 0},
  creditsperview: {type: Sequelize.INTEGER, defaultValue: 0},
  deleted: {type: Sequelize.BOOLEAN, defaultValue: false}
});

Option.belongsTo(Section);

Option.sync({force: false});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// Annotation / Option Schema //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~ //

const OptionAndAnnotation = sequelize.define('optionAndAnnotation', {
  time: Sequelize.INTEGER,
  end: Sequelize.INTEGER,
  emotion: Sequelize.TEXT,
  desc: Sequelize.TEXT,
  deleted: {type: Sequelize.BOOLEAN, defaultValue: false}
});

OptionAndAnnotation.belongsTo(Option);

OptionAndAnnotation.sync({force: false});


// ~~~~~~~~~~~~~~~~~~~~~~ //
// Tester / Option Schema //
// ~~~~~~~~~~~~~~~~~~~~~~ //

const TesterAndOption = sequelize.define('testerAndOption', {
  like: Sequelize.BOOLEAN,
  finished: Sequelize.BOOLEAN,
  comment: Sequelize.TEXT,
  deleted: {type: Sequelize.BOOLEAN, defaultValue: false}
});

Option.belongsToMany(User, {through: 'testerAndOption'});
User.belongsToMany(Option, {through: 'testerAndOption'});

TesterAndOption.sync({force: false});

// ~~~~~~~~~~~~ //
// Frame Schema //
// ~~~~~~~~~~~~ //

const Frame = sequelize.define('frame', {
  time: Sequelize.INTEGER,
  attention: Sequelize.DECIMAL,
  smile: Sequelize.DECIMAL,
  anger: Sequelize.DECIMAL,
  contempt: Sequelize.DECIMAL,
  disgust: Sequelize.DECIMAL,
  fear: Sequelize.DECIMAL,
  happiness: Sequelize.DECIMAL,
  neutral: Sequelize.DECIMAL,
  sadness: Sequelize.DECIMAL,
  surprise: Sequelize.DECIMAL,
  deleted: {type: Sequelize.BOOLEAN, defaultValue: false}
});

Frame.belongsTo(User);

Frame.belongsTo(Option);

Frame.sync({force: false});

// ~~~~~~~~~~ //
// Key Schema //
// ~~~~~~~~~~ //

const Key = sequelize.define('key', {
  key: Sequelize.TEXT
});

Key.sync({force: false});


// ~~~~~~~~~~~~~~~~~~~ //
// Eye Tracking Schema //
// ~~~~~~~~~~~~~~~~~~~ //

const EyeTracking = sequelize.define('eyeTracking', {
  x: Sequelize.DECIMAL,
  y: Sequelize.DECIMAL,
  time: Sequelize.DECIMAL,
  deleted: {type: Sequelize.BOOLEAN, defaultValue: false}
});

EyeTracking.belongsTo(Option);
EyeTracking.belongsTo(User);

EyeTracking.sync({force: false});

// ~~~~~~~~~~~~~~~~~~~~~~~ //
// Section Comments Schema //
// ~~~~~~~~~~~~~~~~~~~~~~~ //

const SectionComments = sequelize.define('sectionComments', {
  summary: Sequelize.TEXT,
  aggregateComments: Sequelize.TEXT,
  deleted: {type: Sequelize.BOOLEAN, defaultValue: false}
});

SectionComments.belongsTo(Option);

SectionComments.sync({force: false});

// ~~~~~~~~~~~~~~~~~~~~ //
// Notifications Schema //
// ~~~~~~~~~~~~~~~~~~~~ //

const Notification = sequelize.define('notifications', {
  seen: {type: Sequelize.BOOLEAN, defaultValue: false},
  sourceUsername: Sequelize.TEXT,
  optionName: Sequelize.STRING
});

//'sourceUsername' is person who caused the notification (eg. tester (target) watched creators video)

Notification.belongsTo(User);
Notification.belongsTo(Option);
Notification.belongsTo(Section);
Notification.belongsTo(Project);

Notification.sync({force: false});

// ~~~~~~~~~~~~~~~~~~ //
// Transaction Schema //
// ~~~~~~~~~~~~~~~~~~ //

const Transaction = sequelize.define('transactions', {
  paid: {type: Sequelize.BOOLEAN, defaultValue: false},
  amount: Sequelize.INTEGER
});

Transaction.belongsTo(User, {as: 'creator'});
Transaction.belongsTo(User, {as: 'tester'});
Transaction.belongsTo(Option);

Transaction.sync({force: false});

const ForgotPassword = sequelize.define('forgotPassword', {
  link: Sequelize.TEXT,
});

ForgotPassword.belongsTo(User);

ForgotPassword.sync({force: false})


module.exports = {
  sequelize,
  User,
  PatreonCampaign,
  FocusGroup,
  FocusGroupAndTester,
  Project,
  Section,
  Option,
  Frame,
  TesterAndOption,
  OptionAndAnnotation,
  Key,
  SectionComments,
  Notification,
  Transaction,
  EyeTracking,
  ForgotPassword
};
