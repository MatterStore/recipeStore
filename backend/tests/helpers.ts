import { assert } from 'chai';
import request, { Response } from 'supertest';

import app from '../app.js';
import Collection from '../models/collection.js';
import Recipe from '../models/recipe.js';

interface UserDetails {
  email: string;
  password: string;
}

let testDataPrepared = false;

export const TestUsers = {
  Beatrice: {
    email: 'beatrice@sushi.kitchen',
    name: 'beatrice',
    password: '1<3fish4dinner',
  }, // Beatrice is a secondary test user
  Chef: {
    email: 'chef@kitchen.table',
    name: 'chef',
    password: 'recipesrgr8',
  }, // Chef is the author of the test recipes
};

export const TestRecipes = {
  Pancakes: {
    id: null,
    user: null,
    title: 'Pancakes',
    time: { hours: '0', minutes: '15' },
    servings: 4,
    ingredients: [
      { text: '2 eggs', name: 'eggs', quantity: '2' },
      {
        text: '1 3/4 cup milk',
        name: 'milk',
        quantity: '1.75',
        unit: 'cups',
      },
      {
        text: '2 cups plain flour',
        name: 'plain flour',
        quantity: '2',
        unit: 'cups',
      },
      { text: 'Butter for the pan' },
    ],
    steps: [
      'Whisk eggs, milk and flour together in a large bowl.',
      'Heat a frying pan to a medium heat and grease with butter.',
      'Pour a small amount of batter and cook until bubbles ' +
        'appear, then flip and cook until set. Remove from pan ' +
        'and repeat until all batter used.',
      'Serve with maple syrup or lemon and sugar.',
    ],
    tags: ['breakfast', 'quick', 'sweet'],
    public: false,
    images: [btoa('An image of pancakes.')],
  },
  Rice: {
    id: null,
    user: null,
    title: 'Plain Rice',
    time: { hours: '0', minutes: '10' },
    servings: 4,
    ingredients: [
      {
        text: '1 cup white rice',
        name: 'white rice',
        unit: 'cups',
        quantity: '1',
      },
      {
        text: '2 cups water',
        name: 'water',
        unit: 'cups',
        quantity: '2',
      },
    ],
    steps: [
      'Place water and rice in a pot over a high heat.',
      'Bring to boil then turn heat to low and cover with lid.',
      'Cook for 10 minutes or until water is fully absorbed.',
      'Remove from heat and serve.',
    ],
    tags: ['side', 'quick', 'savoury'],
    public: true,
    images: [btoa('An image of rice.')],
  },
};

export const TestCollections = {
  Breakfast: {
    id: null,
    user: null,
    name: 'Breakfast',
    tags: ['breakfast', 'quick', 'easy'],
    recipes: [],
    public: false,
  },
  Sides: {
    id: null,
    user: null,
    name: 'Sides',
    tags: ['side', 'savoury'],
    recipes: [],
    public: true,
  },
};

export async function doLoggedIn(
  cb: (token: string) => unknown,
  details: UserDetails = TestUsers.Chef
) {
  await request(app)
    .post('/user/login')
    .send(details)
    .then(async (res) => {
      assert(res.body.success, 'Login failed');
      assert(res.body.token.startsWith('JWT'), 'Bad token.');
      await cb(res.body.token);
    });
}

// Log in as the test recipe user and sets up a test case with the given
// message, passing in an authorization token to the callback.
export function whenLoggedInIt(
  msg: string,
  cb: (token: string) => unknown,
  as: UserDetails = TestUsers.Chef
) {
  it(msg, () => doLoggedIn(cb, as));
}

async function prepareTestRecipes(token: string, user: string) {
  for (const recipe of Object.values(TestRecipes)) {
    const existing = await Recipe.findOne({ user, title: recipe.title });

    if (!existing) {
      await request(app)
        .post('/recipes/new')
        .set('Authorization', token)
        .send(recipe);
    }
  }

  await request(app)
    .get('/recipes/all')
    .set('Authorization', token)
    .then((res) => {
      for (const recipe of res.body.list) {
        for (const obj of Object.values(TestRecipes)) {
          if (recipe.user == user && recipe.title == obj.title) {
            obj.user = user;
            obj.id = recipe._id;
          }
        }
      }
    });
}

/**
 * Prepares `TestCollections` in the database. Should be called after
 * `prepareTestRecipes` as it depends on having thos recipe IDs available.
 */
async function prepareTestCollections(token: string, user: string) {
  TestCollections.Breakfast.recipes.push(TestRecipes.Pancakes.id);
  TestCollections.Sides.recipes.push(TestRecipes.Rice.id);

  for (const collection of Object.values(TestCollections)) {
    const existing = await Collection.findOne({ user, name: collection.name });

    if (!existing) {
      await request(app)
        .post('/collections/new')
        .set('Authorization', token)
        .send(collection);
    }
  }

  await request(app)
    .get('/collections/all')
    .set('Authorization', token)
    .then((res) => {
      for (const collection of res.body.list) {
        for (const obj of Object.values(TestCollections)) {
          if (collection.user == user && collection.name == obj.name) {
            obj.user = user;
            obj.id = collection._id;
          }
        }
      }
    });
}

export async function prepareTestData() {
  if (testDataPrepared) {
    return;
  }

  // Create test users, just returns failure if they already exist, so no
  // need to check for that.
  for (const details of Object.values(TestUsers)) {
    await request(app).post('/user/signup').send(details);
  }

  await doLoggedIn((token) =>
    request(app)
      .get('/user/profile')
      .set('Authorization', token)
      .send()
      .then(async (res) => {
        const user = res.body.user._id;
        await prepareTestRecipes(token, user);
        await prepareTestCollections(token, user);
      })
  );

  testDataPrepared = true;
}

export function itShouldRequireAuthentication(
  endpoint: string,
  method = 'post',
  body?: string | object
) {
  it('Should require authentication', () =>
    request(app)
      // eslint-disable-next-line no-unexpected-multiline
      [method](endpoint)
      .send(body)
      .then((res) =>
        assert(
          res.status == 401 || res.status == 403,
          `No authentication error. Status: ${res.status}.`
        )
      ));
}

/**
 * Assert that a request was successful. Checks res.body.success is true and
 * that the status is 200.
 *
 * @param res Request response.
 * @param msg Failure message.
 */
export function assertSucceeded(res: Response, msg: string) {
  assert(res.body.success, `${msg} Error: ${res.body.msg}`);
  assert(res.status == 200, `Status ${res.status}; should be 200 OK.`);
}

/**
 * Assert that a request failed. Checks res.body.success is false and that the
 * status is at least 400.
 *
 * @param res Request response.
 * @param msg Failure message.
 */
export function assertFailed(res, msg: string) {
  assert(!res.body.success, msg);
  assert(res.status >= 400, "Status indicates success (shouldn't).");
}
