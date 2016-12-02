'use strict';

const url = require('url');

module.exports = function(app) {
  return function(req, res, next) {
    const mainUrl = url.parse(req.url).pathname;

    app.logger.log(
      'info',
      `${req.method} "${mainUrl}" for ${req.ip} ${new Date().toISOString()}`
    );
    app.logger.log('info', `- Query: ${JSON.stringify(req.query)}`);
    app.logger.log('info', `- Body: ${JSON.stringify(req.body)}`);
    next();
  };
};
