import request from 'supertest';
import { assert } from 'chai';

import app from '../app.js';
import User from '../models/user.js';
import {
  assertFailed,
  assertSucceeded,
  itShouldRequireAuthentication,
  whenLoggedInIt,
} from './helpers.js';

// Note: the /user tests delete @test.domain users as part of the tests, so
// best not to use these for other tests.
const TestUsers = {
  Alfred: {
    email: 'test@test.domain',
    name: 'alfred',
    password: 'testpassword',
  }, // Used for /user
  Dominguez: {
    email: 'testuserwithoverlylongemail@test.domain',
    name: 'longnametestuser',
    password: 'testpassword0',
  }, // Used for /user
};

// Clear users collection of test DB before and after tests
const clearTestUsers = () =>
  User.deleteMany({
    email: { $regex: /.*@test\.domain$/ },
  });
before(clearTestUsers);
after(clearTestUsers);

describe('POST /user/signup', () => {
  it('Should register a new user', () =>
    request(app)
      .post('/user/signup')
      .send(TestUsers.Alfred)
      .then((res) => assertSucceeded(res, 'Signup failed.')));

  it('Should prevent duplicate emails', () =>
    request(app)
      .post('/user/signup')
      .send(TestUsers.Alfred)
      .then((res) => assertFailed(res, 'Duplicate email allowed.')));

  it('Should work with long emails', () =>
    request(app)
      .post('/user/signup')
      .send(TestUsers.Dominguez)
      .then((res) => assertSucceeded(res, 'Long email signup failed.')));
});

describe('POST /user/login', () => {
  it('Should fail for missing user', () =>
    request(app)
      .post('/user/login')
      .send({
        email: 'missing@weird.domain',
        password: 'missinguserspassword',
      })
      .then((res) => assertFailed(res, 'Missing user login succeeded.')));

  it('Should fail for incorrect password', () =>
    request(app)
      .post('/user/login')
      .send({
        email: TestUsers.Alfred.email,
        password: 'wrongpassword',
      })
      .then((res) => assertFailed(res, 'Incorrect password allowed.')));

  it('Should allow a valid login', () =>
    request(app)
      .post('/user/login')
      .send(TestUsers.Alfred)
      .then((res) => assertSucceeded(res, 'Correct login rejected.')));

  it('Should allow long emails', () =>
    request(app)
      .post('/user/login')
      .send(TestUsers.Dominguez)
      .then((res) => assertSucceeded(res, 'Long email login rejected.')));
});

describe('POST /user/update-password', () => {
  itShouldRequireAuthentication('/user/update-password');

  const password = 'highlysecure';

  it('Should fail if password not confirmed', () =>
    request(app)
      .post('/user/update-password')
      .send({ password })
      .then((res) =>
        assertFailed(res, 'Password changed without confirmation.')
      ));

  it("Should fail if passwords don't match", () =>
    request(app)
      .post('/user/update-password')
      .send({ password, confirmPassword: 'wrong' })
      .then((res) =>
        assertFailed(res, 'Password changed without confirmation.')
      ));

  whenLoggedInIt(
    'Should be able to change password',
    (token) =>
      request(app)
        .post('/user/update-password')
        .set('Authorization', token)
        .send({ password, confirmPassword: password })
        .then(async (res) => {
          assertSucceeded(res, 'Failed to change password');
          await request(app)
            .post('/user/login')
            .send({
              email: TestUsers.Dominguez.email,
              password: TestUsers.Dominguez.password,
            })
            .then((res) => assertFailed(res, "Password didn't change."));

          await request(app)
            .post('/user/login')
            .send({ email: TestUsers.Dominguez.email, password })
            .then((res) => assertSucceeded(res, 'Password changed wrongly.'));
        }),
    TestUsers.Dominguez
  );
});

describe('GET /user/profile', () => {
  it('Should fail if unauthenticated', () =>
    request(app)
      .get('/user/profile')
      .send()
      .then((res) => assert(res.status == 401, 'Not unauthorised.')));

  it("Should return the logged-in users's profile", () =>
    request(app)
      .post('/user/login')
      .send(TestUsers.Alfred)
      .then(async (res) => {
        assert(res.body.token, 'Missing authorization token.');
        assert(res.status == 200, 'Failed to log in');

        const token = res.body.token;
        await request(app)
          .get('/user/profile')
          .set('Authorization', token)
          .send()
          .then((res) => {
            assertSucceeded(res, 'Profile request failed.');
            assert(
              res.body.user?.name == TestUsers.Alfred.name,
              'Bad profile.'
            );
          });
      }));
});
