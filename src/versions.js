const appv1fn = require('./v1/app');

module.exports = function() {
  const app = this;

  app.appv1 = appv1fn({
    logger: app.logger,
  });

  // var User = {
  //   email: 'admin@feathersjs.com',
  //   password: 'admin',
  //   permissions: ['*']
  // };
  //
  // console.log('Creating user');
  //
  // app.appv1.service('users').create(User).then(user => {
  //   console.log('Created default user', user);
  // }).catch(console.error);

  app.use('/v1', app.appv1);
  return app;
};
