import request from "supertest";
import { assert } from "chai";

import app from "../app.js";
import Recipe from "../models/recipe.js";

import {
  TestRecipes,
  TestUsers,
  whenLoggedInIt,
  prepareTestData,
  itShouldRequireAuthentication,
  assertFailed,
  assertSucceeded,
} from "./helpers.js";

const FLAG_TAG = "TESTRECIPE";

before(async () => {
  await Recipe.deleteMany({ tags: FLAG_TAG }); // Clear test recipes
  await prepareTestData();
});

after(() => Recipe.deleteMany({ tags: FLAG_TAG }));

describe("POST /recipes/new", () => {
  itShouldRequireAuthentication("/recipes/new");

  whenLoggedInIt("Should require necessary fields", (token) =>
    request(app)
      .post("/recipes/new")
      .set("Authorization", token)
      .send({
        title: "Pancakes",
        cooking_time: "15 minutes",
        servings: 4,
      })
      .then((res) => assertFailed(res, "Bad recipe succeeded."))
  );

  let recipe = Object.assign({}, TestRecipes.Pancakes);
  recipe.tags = recipe.tags.concat([FLAG_TAG]);
  whenLoggedInIt("Should allow creation of recipes", (token) =>
    request(app)
      .post("/recipes/new")
      .set("Authorization", token)
      .send(recipe)
      .then((res) => assertSucceeded(res, "Recipe creation failed."))
  );
});

describe("GET /recipes/all", () => {
  itShouldRequireAuthentication("/recipes/all", "get");

  whenLoggedInIt("Should be able to list user recipes", (token) =>
    request(app)
      .get("/recipes/all")
      .set("Authorization", token)
      .send()
      .then((res) => {
        assertSucceeded(res, "Recipe list not retrieved.");
        assert(res.body.list?.length >= 1, "Recipe not in list.");
      })
  );
});

describe("GET /recipes/:id", async () => {
  itShouldRequireAuthentication("/recipes/" + TestRecipes.Pancakes.id, "get");

  whenLoggedInIt("Should work author user", (token) =>
    request(app)
      .get("/recipes/" + TestRecipes.Pancakes.id)
      .set("Authorization", token)
      .send()
      .then((res) => {
        assertSucceeded(res, "Failed to get recipe.");
        assert(
          res.body.recipe?._id == TestRecipes.Pancakes.id,
          "Response didn't have recipe."
        );
      })
  );

  whenLoggedInIt(
    "Shouldn't work for other user",
    (token) =>
      request(app)
        .get("/recipes/" + TestRecipes.Pancakes.id)
        .set("Authorization", token)
        .send()
        .then((res) => assertFailed(res, "Able to access private recipe.")),
    TestUsers.Beatrice
  );
});

describe("DELETE /recipes/:id", async () => {
    itShouldRequireAuthentication("/recipes/" + TestRecipes.Pancakes.id, "delete");
  
    whenLoggedInIt("Should work author user",  (token) =>
      request(app)
        .delete("/recipes/" + TestRecipes.Pancakes.id)
        .set("Authorization", token)
        .send()
        .then(async (res) => {
          assertSucceeded(res, "Failed to get recipe.");
          //shouldn't be able to get recipe after its been deleted
          await request(app)
            .get("/recipes/" + TestRecipes.Pancakes.id)
            .set("Authorization", token)
            .send()
            .then((res) => {
                assertFailed(res, "Could still access recipe.");
            });
        })
        
    );
  
    whenLoggedInIt(
      "Shouldn't work for other user",
      (token) =>
        request(app)
          .get("/recipes/" + TestRecipes.Pancakes.id)
          .set("Authorization", token)
          .send()
          .then((res) => assertFailed(res, "Able to delete private recipe.")),
      TestUsers.Beatrice
    );
  });
