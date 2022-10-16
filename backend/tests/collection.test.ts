import request from 'supertest';
import { assert } from 'chai';

import app from '../app.js';
import Collection from '../models/collection.js';
import {
  assertFailed,
  assertSucceeded,
  itShouldRequireAuthentication,
  prepareTestData,
  TestCollections,
  TestRecipes,
  TestUsers,
  whenLoggedInIt,
} from './helpers.js';

const FLAG_TAG = 'TESTCOLLECTION';

before(async () => {
  await Collection.deleteMany({ tags: FLAG_TAG });
  await prepareTestData();
});

after(() => Collection.deleteMany({ tags: FLAG_TAG }));

describe('POST /collections/new', () => {
  const collection = Object.assign({}, TestCollections.Breakfast);
  collection.tags = collection.tags.concat([FLAG_TAG]);

  itShouldRequireAuthentication('/collections/new', 'post', collection);

  whenLoggedInIt('Should reject invalid object IDs', async (token) => {
    const badCollection = Object.assign({}, collection);
    badCollection.recipes = badCollection.recipes.concat([
      'An Invalid ObjectID',
    ]);

    await request(app)
      .post('/collections/new')
      .set('Authorization', token)
      .send(badCollection)
      .then((res) => assertFailed(res, 'Invalid recipe ID allowed.'));
  });

  whenLoggedInIt('Should allow collection creation', (token) =>
    request(app)
      .post('/collections/new')
      .set('Authorization', token)
      .send(collection)
      .then((res) => assertSucceeded(res, 'Failed to create collection.'))
  );
});

describe('GET /collections/all', () => {
  itShouldRequireAuthentication('/collections/all', 'get');

  whenLoggedInIt('Should return a list of collections', (token) =>
    request(app)
      .get('/collections/all')
      .set('Authorization', token)
      .send()
      .then((res) => {
        assertSucceeded(res, 'Failed to list collections.');
        assert(res.body.list.length >= 1, 'No collections in list.');
      })
  );
});

describe('GET /collections/all/public', () => {
  it('Should return a list with all public collections', () =>
    request(app)
      .get('/collections/all/public')
      .send()
      .then((res) => {
        assertSucceeded(res, 'Failed to list public collections.');
        assert(res.body.list.length >= 1, 'No collections returned.');
        res.body.list.forEach((collection) =>
          assert(collection.public, 'Non-public collection returned.')
        );
      }));
});

describe('GET /collections/:id', () => {
  itShouldRequireAuthentication(
    '/collections/' + TestCollections.Breakfast.id,
    'get'
  );

  whenLoggedInIt('Should work author user', (token) =>
    request(app)
      .get('/collections/' + TestCollections.Breakfast.id)
      .set('Authorization', token)
      .send()
      .then((res) => {
        assertSucceeded(res, 'Failed to get recipe.');
        assert(
          res.body.collection?._id == TestCollections.Breakfast.id,
          "Response didn't have collection."
        );
      })
  );

  whenLoggedInIt(
    "Shouldn't work for other user",
    (token) =>
      request(app)
        .get('/recipes/' + TestCollections.Breakfast.id)
        .set('Authorization', token)
        .send()
        .then((res) =>
          assertFailed(res, 'Was able to access private collection.')
        ),
    TestUsers.Beatrice
  );
});

describe('POST /collections/:id/add', () => {
  // Must be function as id is not set initially.
  const href = () => '/collections/' + TestCollections.Breakfast.id + '/add';

  itShouldRequireAuthentication(href());

  whenLoggedInIt('Should reject invalid recipe IDs', (token) =>
    request(app)
      .post(href())
      .set('Authorization', token)
      .send({ recipes: ['An Invalid ObjectID'] })
      .then((res) => assertFailed(res, 'Invalid recipe ID accepted.'))
  );

  // Must be function as id is not set initially.
  const body = () => ({ recipes: [TestRecipes.Rice.id] });

  // whenLoggedInIt(
  //   "Shouldn't work for non-author user",
  //   (token) =>
  //     request(app)
  //       .post(href())
  //       .set('Authorization', token)
  //       .send(body())
  //       .then((res) => assertFailed(res, 'Non-author user allowed to remove.')),
  //   TestUsers.Beatrice
  // );

  whenLoggedInIt('Should work for author user', (token) =>
    request(app)
      .post(href())
      .set('Authorization', token)
      .send(body())
      .then(async (res) => {
        assertSucceeded(res, 'Adding recipe not successful.');
        await request(app)
          .get('/collections/' + TestCollections.Breakfast.id)
          .set('Authorization', token)
          .send()
          .then((res) => {
            assert(
              res.body.collection.recipes.includes(TestRecipes.Rice.id),
              "Recipe isn't in collection."
            );
          });
      })
  );
});

describe('POST /collections/:id/remove', () => {
  // Must be function as id is not set initially.
  const href = () => '/collections/' + TestCollections.Breakfast.id + '/remove';

  itShouldRequireAuthentication(href());

  whenLoggedInIt('Should reject invalid recipe IDs', (token) =>
    request(app)
      .post(href())
      .set('Authorization', token)
      .send({ recipes: ['An Invalid ObjectID'] })
      .then((res) => assertFailed(res, 'Invalid recipe ID accepted.'))
  );

  // Must be function as id is not set initially.
  const body = () => ({ recipes: [TestRecipes.Rice.id] });

  whenLoggedInIt(
    "Shouldn't work for non-author user",
    (token) =>
      request(app)
        .post(href())
        .set('Authorization', token)
        .send(body())
        .then((res) => assertFailed(res, 'Non-author user allowed.')),
    TestUsers.Beatrice
  );

  whenLoggedInIt('Should work for author user', (token) =>
    request(app)
      .post(href())
      .set('Authorization', token)
      .send(body())
      .then(async (res) => {
        assertSucceeded(res, 'Removing recipe not successful.');
        await request(app)
          .get('/collections/' + TestCollections.Breakfast.id)
          .set('Authorization', token)
          .send()
          .then((res) => {
            assert(
              !res.body.collection.recipes.includes(TestRecipes.Rice.id),
              'Recipe still in collection after removal.'
            );
          });
      })
  );
});

describe('PATCH /collections/:id', () => {
  const href = () => '/collections/' + TestCollections.Breakfast.id;

  const patch = {
    name: 'Quick Sweets',
    tags: ['quick', 'easy'],
  };

  itShouldRequireAuthentication(href(), 'patch');

  whenLoggedInIt(
    'Should fail for non-author user',
    (token) =>
      request(app)
        .patch(href())
        .set('Authorization', token)
        .send(patch)
        .then((res) => assertFailed(res, 'Non-author allowed to update.')),
    TestUsers.Beatrice
  );

  whenLoggedInIt('Should work for author user', (token) =>
    request(app)
      .patch(href())
      .set('Authorization', token)
      .send(patch)
      .then(async (res) => {
        assertSucceeded(res, 'Author not able to update.');
        await request(app)
          .get(href())
          .set('Authorization', token)
          .send()
          .then((res) => {
            assertSucceeded(res, 'Updated collection missing.');

            const collection = res.body.collection;
            assert(collection.name == patch.name, 'Name not updated.');
            assert(
              !collection.tags.includes('breakfast'),
              'Tags not updated correctly.'
            );
            assert(
              collection.public == TestCollections.Breakfast.public,
              'Publicity updated erroneously.'
            );
          });
      })
  );
});

// This test is last because it deletes the test record
describe('DELETE /collections/:id', () => {
  const href = () => '/collections/' + TestCollections.Breakfast.id;

  itShouldRequireAuthentication(href(), 'delete');

  whenLoggedInIt(
    "Shouldn't work for non-author user",
    (token) =>
      request(app)
        .delete(href())
        .set('Authorization', token)
        .send()
        .then((res) => assertFailed(res, 'Non-author user allowed.')),
    TestUsers.Beatrice
  );

  whenLoggedInIt('Should work for author user', (token) =>
    request(app)
      .delete(href())
      .set('Authorization', token)
      .send()
      .then(async (res) => {
        assertSucceeded(res, 'Deleting collection not successful.');
        await request(app)
          .get(href())
          .set('Authorization', token)
          .send()
          .then((res) => assertFailed(res, 'Collection not deleted.'));
      })
  );
});
