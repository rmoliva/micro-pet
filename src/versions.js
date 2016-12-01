const appv1fn = require('./v1/app');

module.exports = function() {
  const app = this;

  app.appv1 = appv1fn({
    logger: app.logger,
  });
  app.use('/v1', app.appv1);
  return app;
};
