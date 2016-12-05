'use strict';

const auth = require('feathers-authentication');

// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GoogleTokenStrategy = require('passport-google-token').Strategy;

module.exports = function() {
  const app = this;

  let config = app.get('v1').auth;

  // config.google.strategy = GoogleStrategy;
  // config.google.tokenStrategy = GoogleTokenStrategy;

  // app.set('auth', config);
  app.configure(auth(config));
};
