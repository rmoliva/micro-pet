'use strict';

const expressWinston = require('express-winston');

module.exports = function(app) {
  return expressWinston.errorLogger({
    msg: '{{err.type}}: {{err.message}} ({{err.name}})',
    winstonInstance: app.logger,
    metaField: true,
  });
};
