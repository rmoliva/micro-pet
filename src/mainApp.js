'use strict';

const path = require('path');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const compress = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const preMiddleware = require('./middleware/pre');
const postMiddleware = require('./middleware/post');

const cors = require('./cors');
const logger = require('./logger');
const appv1fn = require('./v1/app');

// var User = {
//   email: 'admin@feathersjs.com',
//   password: 'admin',
//   permissions: ['*']
// };
//
// console.log('Creating user');
//
// app.service('users').create(User).then(user => {
//   console.log('Created default user', user);
// }).catch(console.error);

const config = configuration();

const app = feathers()
  .configure(config)
  .configure(logger);
app.use(compress())
  .configure(cors)
  .use(favicon(path.join(__dirname, '../public', 'favicon.ico')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .configure(preMiddleware)
  .use('/v1', appv1fn({
    logger: app.logger,
  }))
  .configure(postMiddleware);

module.exports = app;
