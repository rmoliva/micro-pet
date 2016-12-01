'use strict';

const serveStatic = require('feathers').static;
const feathers = require('feathers');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const services = require('./services');
const configuration = require('feathers-configuration');

module.exports = function(options) {
  const config = configuration();
  const app = feathers()
    .configure(config);

  if (options) {
    app.logger = options.logger;
  }

  app.use('/', serveStatic(app.get('v1').public))
    .configure(hooks())
    .configure(rest())
    .configure(socketio())
    .configure(services);

  return app;
};
