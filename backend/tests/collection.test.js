import request from "supertest";
import { assert } from "chai";

import app from '../app.js';
import Collection from "../models/collection.js";
import { doLoggedIn, whenLoggedInIt } from "./helpers.js";


var testRecipeId;
before(async () => {
    await Collection.deleteMany({});
    await doLoggedIn(async (token) => await request(app)
        .get("/recipes/all")
        .set("Authorization", token)
        .send()
        .then(res => res.body.list.forEach(recipe => {
            // Don't use the test data from /recipes tests
            if (!recipe.tags.includes("TESTRECIPE")) {
                testRecipeId = recipe.id;
            }
        }))
    );
});

after(() => Collection.deleteMany({}));

describe("POST /collections/new", () => {
    const testCollection = {
        name: "Breakfast",
        tags: [ "breakfast", "quick", "easy" ],
        recipes: [ testRecipeId ],
        public: true
    };

    it("Should require authentication", () => request(app)
        .post("/collections/new")
        .send(testCollection)
        .then(res => assert(res.status == 401, "Didn't return 401."))
    );

    whenLoggedInIt("Should allow collection creation", token => request(app)
        .post("/collections/new")
        .set("Authorization", token)
        .send(testCollection)
        .then(res => {
            assert(res.body.success, "Failed to create collection.");
            assert(res.status == 200, "Status not 200 OK.");
        })
    );
});

describe("GET /collections/all", () => {
    it("Should require authentication", () => request(app)
        .get("/collections/all")
        .send()
        .then(res => assert(res.status == 401, "Didn't return 401."))
    );

    whenLoggedInIt("Should return a list of collections", token => request(app)
        .get("/collections/all")
        .set("Authorization", token)
        .send()
        .then(res => {
            assert(res.body.success, "Failed to list collections.");
            assert(res.status == 200, "Status not 200 OK.");
            assert(res.body.list.length >= 1, "No collections in list.");
        })
    );
});
