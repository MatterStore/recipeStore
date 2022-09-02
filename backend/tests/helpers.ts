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
    }, // Used for /recipes and /collections
    Chef: {
        email: "chef@kitchen.table",
        name: "chef",
        password: "recipesrgr8",
    }, // Used for /recipes and /collections
};

export const TestRecipes = {
    Pancakes: {
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
            let recipe = await Recipe.findOne({ user: res.body.user.id });
            if (!recipe) {
                await request(app)
                    .post("/recipes/new")
                    .set("Authorization", token)
                    .send(TestRecipes.Pancakes);
            }
        })
    );
}

