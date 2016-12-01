'use strict';

const requestLogger = require('./request-logger');
const profiler = require('./profiler');

module.exports = function() {
  // Add your custom middleware here. Remember, that
  // just like Express the order matters, so error
  // handling middleware should go last.
  const app = this;

  app.use(requestLogger(app))
    .use(profiler(app));
};
