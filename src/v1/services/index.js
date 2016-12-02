'use strict';
const authentication = require('./authentication');
const user = require('./user');
const mongoose = require('mongoose');
module.exports = function() {
  const app = this;

  mongoose.connect(app.get('v1').mongodb);
  mongoose.Promise = global.Promise;

  app.configure(authentication);
  app.configure(user);
};
