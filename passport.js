'use strict';

var RippleStrategy = require('passport-ripple').Strategy;

var config = require('./config');

function InitAuthStrategies(passport) {
  // Ripple IDS OAuth2 setup
  passport.use(new RippleStrategy(config.ripple_ids_oauth,
    function(accessToken, refreshToken, profile, done) {

      // Profile received. We can keep it in DB or smth else

      log.info('Profile received from IDS', profile);
      return done(null, profile);

      // In case if something goes wrong with profile handling we can return an error
      // return done(err, null);
    })
  );
}

module.exports = InitAuthStrategies;
