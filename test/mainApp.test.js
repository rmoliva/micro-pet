'use strict';

const test = require('ava');
const request = require('request');
const mainApp = require('../src/mainApp');
// const inspect = require('eyes').inspector({
//   maxLength: false,
// });

let server = null;
let port = 3000;
const _url = function(path) {
  return `http://localhost:${port}${path}`;
};

/* eslint-disable no-invalid-this*/
test.before.cb('opening server', (t) => {
  server = mainApp.listen(port);
  server.once('listening', t.end);
});

test.cb('starts and shows the index page', (t) => {
  request(_url('/v1/'), function(err, res, body) {
    // inspect(body);

    t.not(body.indexOf('<html>'), -1);
    t.end();
  });
});

test.cb('shows a 404 HTML page', (t) => {
  request({
    url: _url('/path/to/nowhere/'),
    headers: {
      'Accept': 'text/html',
    },
  }, function(err, res, body) {
    t.plan(2);
    t.is(res.statusCode, 404);
    t.not(body.indexOf('<html>'), -1);
    t.end();
  });
});

test.cb('shows a 404 JSON error without stack trace', (t) => {
  request({
    url: _url('/path/to/nowhere/'),
    json: true,
  }, function(err, res, body) {
    t.plan(4);
    t.is(res.statusCode, 404);
    t.is(body.code, 404);
    t.is(body.message, 'Page not found');
    t.is(body.name, 'NotFound');
    t.end();
  });
});

test.after.always.cb('closing server', (t) => {
  server.close(t.end);
});
/* eslint-enable no-invalid-this*/
