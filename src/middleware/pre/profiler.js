'use strict';

const expressWinston = require('express-winston');

module.exports = function(app) {
  return expressWinston.logger({
    winstonInstance: app.logger,
    msg: '- Completed {{res.statusCode}} OK in {{res.responseTime}}ms',
  });
};
