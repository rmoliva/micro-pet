'use strict';

// DEBUG=feathers-authentication*
const test = require('ava');
const request = require('request');
const Promise = require('bluebird');
const sinon = require('sinon');
require('sinon-as-promised')(Promise);
// const inspect = require('eyes').inspector({
//   maxLength: false,
// });
const mainApp = require('../src/mainApp');

// TODO: Quitar estas variables y meterlas dentro de testeos
let port = 3001;
let server = null;
// let UserData = {
//   email: 'admin@feathersjs.com',
//   password: 'admin',
//   permissions: ['*'],
// };
let stub1 = null;
// let userId = null;

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
    // let service = mainApp.appv1.service('/users');
    // service.create(UserData).then(function(data) {
    //   userId = data._id;
    //   t.end();
    // }).catch(function(err) {
    //   t.fail(err.message);
    //   t.end();
    // });
    const service = mainApp.appv1.service('/users');

    stub1 = sinon.stub(service, 'find');
    t.end();
  });
});

test.cb('with valid credentials can auth and get a token', (t) => {
  stub1.resolves([{
    email: 'admin@feathersjs.com',
    password: '$2a$10$KdGb.nswG9Tth76WZjjma.C6.qFNwBs8fGFTTatgrunB.608rk9Xa',
  }]);

  t.plan(3);

  _promiseRequest({
    url: _url('/v1/auth/local'),
    method: 'POST',
    json: true,
    form: {
      email: 'admin@feathersjs.com',
      password: 'admin',
    },
  }).then(function(data) {
    stub1.restore();

    // Si hace un redirect a /auth/success es que todo ha ido bien
    t.is(data.res.statusCode, 201);

    // Guardamos el token
    let token = data.body.token;
    t.truthy(token);

    return Promise.all([
      // Fail without token
      _promiseRequest({
        url: _url('/v1/users'),
        json: true,
        method: 'GET',
      }).then(function(data) {
        // No authenticated
        t.is(data.res.statusCode, 401);
      }),
      // Pass with token
      // _promiseRequest({
      //   url: _url(`/v1/users?token=${token}`),
      //   json: true,
      //   method: 'GET',
      // }).then(function(data) {
      //   console.log('test With');
      //   inspect(data.body);
      //
      //   // Authenticated
      //   t.is(data.res.statusCode, 200);
      // }),
    ]).then(function() {
      t.end();
    });
  });
});

test.after.always.cb((t) => {
  // let service = mainApp.appv1.service('/users');
  // service.remove(userId, {}).then(function() {
  //   t.end();
  // }).catch(
  //   t.end
  // );
  server.close(t.end);
});
/* eslint-enable no-invalid-this*/
