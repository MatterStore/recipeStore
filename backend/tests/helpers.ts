import app from '../app.js';

import { assert } from 'chai';
import request from 'supertest';
import Recipe from '../models/recipe.js';

interface UserDetails {
    email: string,
    password: string
};

export const TestUsers = {
    Beatrice: {
        email: "beatrice@sushi.kitchen",
        name: "beatrice",
        password: "1<3fish4dinner"
    }, // Beatrice is a secondary test user
    Chef: {
        email: "chef@kitchen.table",
        name: "chef",
        password: "recipesrgr8",
    }, // Chef is the author of the test recipes
};

export const TestRecipes = {
    Pancakes: {
        id: null,
        user: null,
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
    },
    Rice: {
        id: null,
        user: null,
        title: "Plain Rice",
        cooking_time: "10 minutes",
        servings: 4,
        ingredients: [
            {
                text: "1 cup white rice",
                name: "white rice",
                unit: "cups",
                quantity: "1"
            },
            {
                text: "2 cups water",
                name: "water",
                unit: "cups",
                quantity: "2"
            }
        ],
        steps: [
            "Place water and rice in a pot over a high heat.",
            "Bring to boil then turn heat to low and cover with lid.",
            "Cook for 10 minutes or until water is fully absorbed.",
            "Remove from heat and serve."
        ],
        tags: [ "side", "quick", "savoury" ],
        public: true
    }
};

export async function doLoggedIn(
    cb: (token: string) => any,
    details: UserDetails = TestUsers.Chef
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
export function whenLoggedInIt(
    msg: string, cb: (token: string) => any, as: UserDetails = TestUsers.Chef
) {
    it(msg, () => doLoggedIn(cb, as));
}

export async function prepareTestData() {
    // Create test users, just returns failure if they already exist, so no
    // need to check for that.
    for (let details of Object.values(TestUsers)) {
        await request(app).post("/user/signup").send(details);
    }

    await doLoggedIn(token => request(app)
        .get("/user/profile")
        .set("Authorization", token)
        .send()
        .then(async (res) => {
            let user = res.body.user.id;

            for (let recipe of Object.values(TestRecipes)) {
                let existing = await Recipe.findOne(
                    { user, title: recipe.title }
                );

                if (!existing) {
                    await request(app)
                        .post("/recipes/new")
                        .set("Authorization", token)
                        .send(recipe);
                }
            }

            request(app)
                .get("/recipes/all")
                .set("Authorization", token)
                .then(res => {
                    for (let recipe of res.body.list) {
                        for (let obj of Object.values(TestRecipes)) {
                            if (
                                recipe.user == user
                                && recipe.title == obj.title
                            ) {
                                obj.user = user;
                                obj.id = recipe.id;
                            }
                        }
                    }
                });
        })
    );
}

export function itShouldRequireAuthentication(
    endpoint: string,
    method: string = "post",
    body?: string | object
) {
    it("Should require authentication", () => request(app)[method](endpoint)
        .send(body)
        .then(res => assert(res.status == 401, "Didn't return 401."))
    );
}

/**
 * Assert that a request was successful. Checks res.body.success is true and
 * that the status is 200.
 * 
 * @param res Request response. 
 * @param msg Failure message.
 */
export function assertSucceeded(res, msg: string) {
    assert(res.body.success, msg);
    assert(res.status == 200, "Status not 200 OK.");
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
