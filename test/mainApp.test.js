'use strict';

const test = require('ava');
const request = require('request');
const mainApp = require('../src/mainApp');

let server = null;

/* eslint-disable no-invalid-this*/
test.before('opening server', (t) => {
  server = mainApp.listen(3030);
});

test.before.cb('listening server', (t) => {
  server.once('listening', t.end);
});

test.cb('starts and shows the index page', (t) => {
  request('http://localhost:3030/v1/', function(err, res, body) {
    t.not(body.indexOf('<html>'), -1);
    t.end();
  });
});

test.cb('shows a 404 HTML page', (t) => {
  request({
    url: 'http://localhost:3030/path/to/nowhere',
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
    url: 'http://localhost:3030/path/to/nowhere',
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
