'use strict';

// Packages
var express = require('express');
var app = express();
var morgan = require('morgan');
var passport = require('passport');
require('./passport')(passport);

var log = require('./log');
var config = require('./config');

app.use(passport.initialize());
app.enable('trust proxy');

// CORS Support
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method.toLowerCase() === 'options') {
    return res.sendStatus(204);
  }

  return next();
});

//Logging
app.use(morgan(function(m, req, res) {
  log.info('Server request', {
    method: req.method,
    // path: req.path,
    originalUrl: req.originalUrl,
    user: req.user && req.user.id,
    referer: req.headers && req.headers.referer,
    ip: req.ip,
    ips: req.ips,
    start: req._startTime && req._startTime.getTime(),
    code: res.statusCode
  });
}));


// Routes for Ripple ID Service OAuth2 Login Flow
var authRouter = express.Router();

// Redirect user to ripple id service auth URL
authRouter.get('/login', passport.authenticate('ripple', {session: false}));
authRouter.get('/register', passport.authenticate('ripple', {session: false, _type: 'signup'}));

authRouter.get('/callback',
  passport.authenticate('ripple', {session: false, failureRedirect: '/auth/'}),
  function(req, res) {
    res.send('You\'re logged in');
  }
);

// A page for testing purposes
authRouter.get('/', function(req, res) {
  res.send('OK');
});

// REGISTER ROUTES
app.use('/', authRouter);

// START THE SERVER
app.listen(config.port);
log.info('Server listens to port ' + config.port + '!');
