import request from "supertest";
import { assert } from "chai";

import app from "../app.js";
import Collection from "../models/collection.js";
import {
  assertFailed,
  assertSucceeded,
  itShouldRequireAuthentication,
  prepareTestData,
  TestCollections,
  TestRecipes,
  TestUsers,
  whenLoggedInIt,
} from "./helpers.js";

const FLAG_TAG = "TESTCOLLECTION";

before(async () => {
  await Collection.deleteMany({ tags: FLAG_TAG });
  await prepareTestData();
});

after(() => Collection.deleteMany({ tags: FLAG_TAG }));

describe("POST /collections/new", () => {
  let collection = Object.assign({}, TestCollections.Breakfast);
  collection.tags = collection.tags.concat([FLAG_TAG]);

  itShouldRequireAuthentication("/collections/new", "post", collection);

  whenLoggedInIt("Should reject invalid object IDs", (token) => {
    let badCollection = Object.assign({}, collection);
    badCollection.recipes = badCollection.recipes.concat([
      "An Invalid ObjectID",
    ]);

    request(app)
      .post("/collections/new")
      .set("Authorization", token)
      .send(badCollection)
      .then((res) => assertFailed(res, "Invalid recipe ID allowed."));
  });

  whenLoggedInIt("Should allow collection creation", (token) =>
    request(app)
      .post("/collections/new")
      .set("Authorization", token)
      .send(collection)
      .then((res) => assertSucceeded(res, "Failed to create collection."))
  );
});

describe("GET /collections/all", () => {
  itShouldRequireAuthentication("/collections/all", "get");

  whenLoggedInIt("Should return a list of collections", (token) =>
    request(app)
      .get("/collections/all")
      .set("Authorization", token)
      .send()
      .then((res) => {
        assertSucceeded(res, "Failed to list collections.");
        assert(res.body.list.length >= 1, "No collections in list.");
      })
  );
});

describe("GET /collections/:id", () => {
  itShouldRequireAuthentication(
    "/collections/" + TestCollections.Breakfast.id,
    "get"
  );

  whenLoggedInIt("Should work author user", (token) =>
    request(app)
      .get("/collections/" + TestCollections.Breakfast.id)
      .set("Authorization", token)
      .send()
      .then((res) => {
        assertSucceeded(res, "Failed to get recipe.");
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
        .get("/recipes/" + TestCollections.Breakfast.id)
        .set("Authorization", token)
        .send()
        .then((res) =>
          assertFailed(res, "Was able to access private collection.")
        ),
    TestUsers.Beatrice
  );
});

describe("POST /collections/:id/add", () => {
  // Must be function as id is not set initially.
  const href = () => "/collections/" + TestCollections.Breakfast.id + "/add";

  itShouldRequireAuthentication(href());

  whenLoggedInIt("Should reject invalid recipe IDs", (token) =>
    request(app)
      .post(href())
      .set("Authorization", token)
      .send({ recipes: ["An Invalid ObjectID"] })
      .then((res) => assertFailed(res, "Invalid recipe ID accepted."))
  );

  // Must be function as id is not set initially.
  const body = () => ({ recipes: [TestRecipes.Rice.id] });

  whenLoggedInIt(
    "Shouldn't work for non-author user",
    (token) =>
      request(app)
        .post(href())
        .set("Authorization", token)
        .send(body())
        .then((res) => assertFailed(res, "Non-author user allowed to remove.")),
    TestUsers.Beatrice
  );

  whenLoggedInIt("Should work for author user", (token) =>
    request(app)
      .post(href())
      .set("Authorization", token)
      .send(body())
      .then((res) => {
        assertSucceeded(res, "Adding recipe not successful.");
        request(app)
          .get("/collections/" + TestCollections.Breakfast.id)
          .set("Authorization", token)
          .send()
          .then((res) => {
            assert(
              res.body.collection.recipes.contains(TestRecipes.Rice.id),
              "Recipe isn't in collection."
            );
          });
      })
  );
});

describe("POST /collections/:id/remove", () => {
  // Must be function as id is not set initially.
  const href = () => "/collections/" + TestCollections.Breakfast.id + "/remove";

  itShouldRequireAuthentication(href());

  whenLoggedInIt("Should reject invalid recipe IDs", (token) =>
    request(app)
      .post(href())
      .set("Authorization", token)
      .send({ recipes: ["An Invalid ObjectID"] })
      .then((res) => assertFailed(res, "Invalid recipe ID accepted."))
  );

  // Must be function as id is not set initially.
  const body = () => ({ recipes: [TestRecipes.Rice.id] });

  whenLoggedInIt(
    "Shouldn't work for non-author user",
    (token) =>
      request(app)
        .post(href())
        .set("Authorization", token)
        .send(body())
        .then((res) => assertFailed(res, "Non-author user allowed.")),
    TestUsers.Beatrice
  );

  whenLoggedInIt("Should work for author user", (token) =>
    request(app)
      .post(href())
      .set("Authorization", token)
      .send(body())
      .then((res) => {
        assertSucceeded(res, "Removing recipe not successful.");
        request(app)
          .get("/collections/" + TestCollections.Breakfast.id)
          .set("Authorization", token)
          .send()
          .then((res) => {
            assert(
              !res.body.collection.recipes.contains(TestRecipes.Rice.id),
              "Recipe still in collection after removal."
            );
          });
      })
  );
});

describe("POST /collections/:id/delete", () => {
  itShouldRequireAuthentication(
    "/collections/" + TestCollections.Breakfast.id + "/delete"
  );

  whenLoggedInIt(
    "Shouldn't work for non-author user",
    (token) =>
      request(app)
        .post("/collections/" + TestCollections.Breakfast.id + "/delete")
        .set("Authorization", token)
        .send()
        .then((res) => assertFailed(res, "Non-author user allowed.")),
    TestUsers.Beatrice
  );

  whenLoggedInIt("Should work for author user", (token) =>
    request(app)
      .post("/collections/" + TestCollections.Breakfast.id + "/delete")
      .set("Authorization", token)
      .send()
      .then((res) => {
        assertSucceeded(res, "Deleting collection not successful.");
        request(app)
          .get("/collections/" + TestCollections.Breakfast.id)
          .set("Authorization", token)
          .send()
          .then((res) => assertFailed(res, "Collection not deleted."));
      })
  );
});
