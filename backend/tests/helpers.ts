import app from '../app.js';

import { assert } from 'chai';
import request from 'supertest';

interface UserDetails {
    email: string,
    password: string
};

// Note: the /user tests delete @test.domain users as part of the tests, so
// best not to use these for other tests.
export const TestUsers = {
    Alfred: {
        email: "test@test.domain",
        name: "alfred",
        password: "testpassword"
    }, // Used for /user
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
    Dominguez: {
        email: "testuserwithoverlylongemail@test.domain",
        name: "longnametestuser",
        password: "testpassword0"
    }, // Used for /user
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

export async function prepareTestUsers() {
    // Create test users, just returns failure if they already exist, so no
    // need to check for that.
    for (let details of Object.values(TestUsers)) {
        await request(app).post("/user/signup").send(details);
    }
}

