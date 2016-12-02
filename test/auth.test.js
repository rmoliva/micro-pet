'use strict';

// DEBUG=feathers-authentication*
const test = require('ava');
const request = require('request');
const Promise = require('bluebird');
// const inspect = require('eyes').inspector({
//   maxLength: false,
// });
const mainApp = require('../src/mainApp');

let port = 3001;
let server = null;
let User = {
  email: 'admin@feathersjs.com',
  password: 'admin',
  permissions: ['*'],
};
let userId = null;

const _url = function(path) {
  return `http://localhost:${port}${path}`;
};

const _promiseRequest = function(options) {
  return new Promise(function(resolve, reject) {
    request(options, function(err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve({
          res: res,
          body: body,
        });
      }
    });
  });
};

test.before.cb((t) => {
  server = mainApp.listen(port);
  server.once('listening', function() {
    let service = mainApp.appv1.service('/users');
    service.create(User).then(function(data) {
      userId = data._id;
      t.end();
    }).catch(function(err) {
      t.fail(err.message);
      t.end();
    });
  });
});

test.cb('with valid credentials can auth and get a token', (t) => {
  _promiseRequest({
    url: _url('/v1/auth/local'),
    method: 'POST',
    json: true,
    form: {
      email: User.email,
      password: 'admin',
    },
  }).then(function(data) {
    // Si hace un redirect a /auth/success es que todo ha ido bien
    t.is(data.res.statusCode, 201);

    // Guardamos el token
    let token = data.body.token;
    t.truthy(token);

    // Fail without token
    Promise.all([
      _promiseRequest({
        url: _url('/v1/users'),
        json: true,
        method: 'GET',
      }, function(data) {
        // No authenticated
        t.is(data.res.statusCode, 401);
      }),
      _promiseRequest({
        url: _url(`/v1/users?token=${token}`),
        json: true,
        method: 'GET',
      }, function(data) {
        // Authenticated
        t.is(data.res.statusCode, 200);
      }),
    ]).then(function() {
      t.end();
    });
  });
});

test.after.always.cb((t) => {
  let service = mainApp.appv1.service('/users');
  service.remove(userId, {}).then(function() {
    t.end();
  }).catch(
    t.end
  );
  server.close(t.end);
});
/* eslint-enable no-invalid-this*/
