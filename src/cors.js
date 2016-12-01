const cors = require('cors');
const errors = require('feathers-errors');

module.exports = function() {
  const app = this;
  const corsOptions = {
    origin(origin, callback) {
      const whitelist = app.get('corsWhitelist');
      const originIsWhitelisted = whitelist.indexOf(origin) !== -1 ||
        whitelist.indexOf('*') !== -1;

      callback(
        originIsWhitelisted ?
          null :
          new errors.BadRequest('CORS protected origin'),
        originIsWhitelisted
      );
    },
  };
  const corsMiddleware = function(...args) {
    return cors(corsOptions).apply(this, args);
  };

  app.options('*', cors(corsOptions))
    .use(corsMiddleware);

  return app;
};
