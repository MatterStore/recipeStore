import request from "supertest";
import { assert } from "chai";

import app from '../app.js';
import { Recipe } from "../models/recipe.js";


interface UserDetails {
    email: string,
    password: string
};

const USER_A_DETAILS = {
    email: "chef@kitchen.table",
    name: "chef",
    password: "recipesrgr8",
};

const USER_B_DETAILS = {
    email: "beatrice@sushi.kitchen",
    name: "beatrice",
    password: "1<3fish4dinner"
};

async function doLoggedIn(
    cb: (token: string) => any,
    details: UserDetails = USER_A_DETAILS
) {
    await request(app)
        .post("/user/login")
        .send(details)
        .then(res => {
            assert(res.body.success, "Login failed");
            assert(res.body.token.startsWith("JWT"), "Bad token.");
            cb(res.body.token);
        });
}

// Log in as the test recipe user and sets up a test case with the given
// message, passing in an authorization token to the callback.
function whenLoggedInIt(
    msg: string, cb: (token: string) => any, as: UserDetails = USER_A_DETAILS
) {
    it(msg, () => doLoggedIn(cb, as));
}

before(async () => {
    Recipe.deleteMany({}); // Clear recipes collection

    // Create test users, just returns failure if they already exist, so no
    // need to check for that.
    await request(app).post("/user/signup").send(USER_A_DETAILS);
    await request(app).post("/user/signup").send(USER_B_DETAILS);
});

describe("POST /recipes/new", () => {
    it("Should require authorization", () => request(app)
        .post("/recipes/new")
        .send()
        .then(res => assert(res.status == 401, "Didn't reply 401."))
    );

    whenLoggedInIt("Should require necessary fields", token => request(app)
        .post("/recipes/new")
        .set("Authorization", token)
        .send({
            title: "Pancakes",
            cooking_time: "15 minutes",
            servings: 4
        })
        .then(res => {
            assert(!res.body.success, "Bad recipe succeeded.");
            assert(res.status >= 400, "Bad request succeeded.");
        })
    );

    whenLoggedInIt("Should allow creation of recipes", token => request(app)
        .post("/recipes/new")
        .set("Authorization", token)
        .send({
            title: "Pancakes",
            cooking_time: "15 minutes",
            servings: 4,
            ingredients: [
                { text: "2 eggs", name: "eggs", quantity: "2" },
                {
                    text: "1 3/4 cup milk",
                    name: "milk",
                    quantity: "1.75",
                    unit: "cups"
                },
                {
                    text: "2 cups plain flour",
                    name: "plain flour",
                    quantity: "2",
                    unit: "cups"
                },
                { text: "Butter for the pan" }
            ],
            steps: [
                "Whisk eggs, milk and flour together in a large bowl.",
                "Heat a frying pan to a medium heat and grease with butter.",
                (
                    "Pour a small amount of batter and cook until bubbles "
                    + "appear, then flip and cook until set. Remove from pan "
                    + "and repeat until all batter used."
                ),
                "Serve with maple syrup or lemon and sugar."
            ],
            tags: [ "breakfast", "quick", "sweet" ],
            public: false
        })
        .then(res => {
            assert(
                res.body.success,
                `Recipe creation failed. msg: ${res.body.msg}`
            );
            assert(res.status == 200, "Status not 200 OK.");
        })
    );
});

describe("GET /recipes/all", () => {
    it("Should require authorization", () => request(app)
        .post("/recipes/new")
        .send()
        .then(res => assert(res.status == 401, "Didn't reply 401."))
    );

    whenLoggedInIt("Should be able to list user recipes", token => request(app)
        .get("/recipes/all")
        .set("Authorization", token)
        .send()
        .then(res => {
            assert(res.body.success, "Recipe list not retrieved.");
            assert(res.status == 200, "Status not 200 OK.");
            assert(res.body.list?.length >= 1, "Recipe not in list.");
        })
    );
});

describe("GET /recipes/:id", async () => {
    // Note; this is supposed to find a private recipe
    let id = null;
    before(async () => await doLoggedIn(token => request(app)
        .get("/recipes/all")
        .set("Authorization", token)
        .send()
        .then(res => {
            assert(res.body.list?.length >= 1, "Recipe not in list.");
            id = res.body.recipes[0].id;
        })
    ));

    whenLoggedInIt("Should work author user", token => request(app)
        .get("/recipes/" + id)
        .set("Authorization", token)
        .send()
        .then(res => {
            assert(res.body.success, "Failed to get recipe.");
            assert(
                res.body.recipe?.id == id,
                "Response didn't have recipe."
            );
            assert(res.status == 200, "Status not 200 OK.");
        })
    );

    whenLoggedInIt(
        "Shouldn't work for other user",
        token => request(app)
            .get("/recipes/" + id)
            .set("Authorization", token)
            .send()
            .then(res => {
                assert(!res.body.success, "Was able to access private recipe.");
                assert(res.status >= 400, "Status indicates success (shouldn't)");
            }),
        USER_B_DETAILS
    );

    it("Should not work if unauthenticated", () => request(app)
        .get("/recipes/" + id)
        .send()
        .then(res => assert(
            res.status == 401, "Allowed unauthenticated user."
        ))
    );
});
