'use strict';

const path = require('path');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const compress = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const cors = require('./cors');
const logger = require('./logger');
const versions = require('./versions');
const preMiddleware = require('./middleware/pre');
const postMiddleware = require('./middleware/post');

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
  .configure(versions)
  .configure(postMiddleware);

module.exports = app;
