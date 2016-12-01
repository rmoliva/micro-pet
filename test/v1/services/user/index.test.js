'use strict';

const test = require('ava');
const app = require('../../../../src/v1/app');

test('registered the users service', (t) => {
  t.truthy(app({}).service('users'));
});
