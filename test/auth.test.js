'use strict';

const test = require('ava');
const request = require('request');
const inspect = require('eyes').inspector({
  maxLength: false,
});
const mainApp = require('../src/mainApp');

let server = null;
let User = {
  email: 'admin@feathersjs.com',
  password: 'admin',
  permissions: ['*'],
};
let userId = null;

/* eslint-disable no-invalid-this*/
test.before('opening server', (t) => {
  server = mainApp.listen(3030);
});

test.before.cb('listening server', (t) => {
  server.once('listening', t.end);
});

test.before.cb('insert user', (t) => {
  let service = mainApp.appv1.service('/users');
  service.create(User).then(function(data) {
    userId = data._id;
    t.end();
  }).catch(function(err) {
    t.fail(err.message);
    t.end();
  });
});

test.cb('with valid credentials can auth and get a token', (t) => {
  request({
    url: 'http://localhost:3030/v1/auth/local',
    method: 'POST',
    headers: {
      'Content-Type': 'application-json',
    },
    form: {
      email: User.email,
      password: User.password,
    },
  }, function(err, res, body) {
    // inspect(res);
    t.is(res.statusCode, 200);

    t.not(body.indexOf('<html>'), -1);
    t.end();
  });
});

test.after.always.cb('remove user', (t) => {
  let service = mainApp.appv1.service('/users');
  service.remove(userId, {}).then(
    t.end
  ).catch(
    t.end
  );
});

test.after.always.cb('closing server', (t) => {
  server.close(t.end);
});
/* eslint-enable no-invalid-this*/
