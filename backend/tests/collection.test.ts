import request from "supertest";
import { assert } from "chai";

import app from '../app.js';
import Collection from "../models/collection.js";
import {
    assertFailed,
    assertSucceeded,
    itShouldRequireAuthentication,
    TestRecipes,
    TestUsers,
    whenLoggedInIt
} from "./helpers.js";

before(async () => await Collection.deleteMany({}));

after(() => Collection.deleteMany({}));

var testCollectionId;

describe("POST /collections/new", () => {
    const testCollection = {
        name: "Breakfast",
        tags: [ "breakfast", "quick", "easy" ],
        recipes: [ TestRecipes.Pancakes.id ],
        public: false
    };

    itShouldRequireAuthentication("/collections/new", "post", testCollection);

    whenLoggedInIt("Should reject invalid object IDs", token => {
        let badCollection = Object.assign({}, testCollection);
        badCollection.recipes = badCollection
            .recipes
            .concat(["An Invalid ObjectID"]);
        
        request(app)
            .post("/collections/new")
            .set("Authorization", token)
            .send(badCollection)
            .then(res => assertFailed(res, "Invalid recipe ID allowed."))
    })

    whenLoggedInIt("Should allow collection creation", token => request(app)
        .post("/collections/new")
        .set("Authorization", token)
        .send(testCollection)
        .then(res => assertSucceeded(res, "Failed to create collection."))
    );
});

describe("GET /collections/all", () => {
    itShouldRequireAuthentication("/collections/all", "get");

    whenLoggedInIt("Should return a list of collections", token => request(app)
        .get("/collections/all")
        .set("Authorization", token)
        .send()
        .then(res => {
            assertSucceeded(res, "Failed to list collections.");
            assert(res.body.list.length >= 1, "No collections in list.");
            testCollectionId = res.body.recipes[0].id;
        })
    );
});

describe("GET /collections/:id", () => {
    itShouldRequireAuthentication("/collections/" + testCollectionId, "get");

    whenLoggedInIt("Should work author user", token => request(app)
        .get("/collections/" + testCollectionId)
        .set("Authorization", token)
        .send()
        .then(res => {
            assertSucceeded(res, "Failed to get recipe.");
            assert(
                res.body.collection?.id == testCollectionId,
                "Response didn't have collection."
            );
        })
    );

    whenLoggedInIt(
        "Shouldn't work for other user",
        token => request(app)
            .get("/recipes/" + testCollectionId)
            .set("Authorization", token)
            .send()
            .then(res => assertFailed(
                res, "Was able to access private collection."
            )),
        TestUsers.Beatrice
    );
});

describe("POST /collections/:id/add", () => {
    let href = "/collections/" + testCollectionId + "/add";
    
    itShouldRequireAuthentication(href);

    whenLoggedInIt("Should reject invalid recipe IDs", token => request(app)
        .post(href)
        .set("Authorization", token)
        .send({ recipes: ["An Invalid ObjectID"] })
        .then(res => assertFailed(res, "Invalid recipe ID accepted."))
    );

    const body = { recipes: [TestRecipes.Rice.id] };

    whenLoggedInIt(
        "Shouldn't work for non-author user",
        token => request(app)
            .post(href)
            .set("Authorization", token)
            .send(body)
            .then(res => assertFailed(res, "Non-author user allowed to remove.")),
        TestUsers.Beatrice
    );

    whenLoggedInIt("Should work for author user", token => request(app)
        .post(href)
        .set("Authorization", token)
        .send(body)
        .then(res => {
            assertSucceeded(res, "Adding recipe not successful.");
            request(app)
                .get("/collections/" + testCollectionId)
                .set("Authorization", token)
                .send()
                .then(res => {
                    assert(
                        res.body.collection.recipes.contains(
                            TestRecipes.Rice.id
                        ),
                        "Recipe isn't in collection."
                    );
                });
        })
    );
});

describe("POST /collections/:id/remove", () => {
    let href = "/collections/" + testCollectionId + "/remove";
    
    itShouldRequireAuthentication(href);

    whenLoggedInIt("Should reject invalid recipe IDs", token => request(app)
        .post(href)
        .set("Authorization", token)
        .send({ recipes: ["An Invalid ObjectID"] })
        .then(res => assertFailed(res, "Invalid recipe ID accepted."))
    );

    const body = { recipes: [TestRecipes.Rice.id ]};

    whenLoggedInIt(
        "Shouldn't work for non-author user",
        token => request(app)
            .post(href)
            .set("Authorization", token)
            .send(body)
            .then(res => assertFailed(res, "Non-author user allowed.")),
        TestUsers.Beatrice
    );

    whenLoggedInIt("Should work for author user", token => request(app)
        .post(href)
        .set("Authorization", token)
        .send(body)
        .then(res => {
            assertSucceeded(res, "Removing recipe not successful.");
            request(app)
                .get("/collections/" + testCollectionId)
                .set("Authorization", token)
                .send()
                .then(res => {
                    assert(
                        !res.body.collection.recipes.contains(
                            TestRecipes.Rice.id
                        ),
                        "Recipe still in collection after removal."
                    );
                });
        })
    );
});

describe("POST /collections/:id/delete", () => {
    let href = "/collections/" + testCollectionId + "/delete";

    itShouldRequireAuthentication(href);

    whenLoggedInIt(
        "Shouldn't work for non-author user",
        token => request(app)
            .post(href)
            .set("Authorization", token)
            .send()
            .then(res => assertFailed(res, "Non-author user allowed.")),
        TestUsers.Beatrice
    );

    whenLoggedInIt("Should work for author user", token => request(app)
        .post(href)
        .set("Authorization", token)
        .send()
        .then(res => {
            assertSucceeded(res, "Deleting collection not successful.");
            request(app)
                .get("/collections/" + testCollectionId)
                .set("Authorization", token)
                .send()
                .then(res => assertFailed(res, "Collection not deleted."));
        })
    );
});
