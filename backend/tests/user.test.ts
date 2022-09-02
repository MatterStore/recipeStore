import request from "supertest";
import { assert } from "chai";

import app from '../app.js';
import User from "../models/user.js";

// Note: the /user tests delete @test.domain users as part of the tests, so
// best not to use these for other tests.
const TestUsers = {
    Alfred: {
        email: "test@test.domain",
        name: "alfred",
        password: "testpassword"
    }, // Used for /user
    Dominguez: {
        email: "testuserwithoverlylongemail@test.domain",
        name: "longnametestuser",
        password: "testpassword0"
    }, // Used for /user
};

// Clear users collection of test DB before and after tests
const clearTestUsers = () => User.deleteMany({
    email: { $regex: /.*@test\.domain$/ }
});
before(clearTestUsers);
after(clearTestUsers);

describe("POST /user/signup", () => {
    it("Should register a new user", () => request(app)
        .post("/user/signup")
        .send(TestUsers.Alfred)
        .then(res => {
            assert(res.body.success, "Signup failed.");
            assert(res.status === 200, "Signup not 200 OK.");
        })
    );

    it("Should prevent duplicate emails", () => request(app)
        .post("/user/signup")
        .send(TestUsers.Alfred)
        .then(res => {
            assert(!res.body.success, "Duplicate email allowed.");
            assert(res.status === 422, "Signup not error code.");
        })
    );

    it("Should work with long emails", () => request(app)
        .post("/user/signup")
        .send(TestUsers.Dominguez)
        .then(res => {
            assert(res.body.success, "Long email signup failed.");
            assert(res.status === 200, "Signup not 200 OK.");
        })
    );
});

describe("POST /user/login", () => {
    it("Should fail for missing user", () => request(app)
        .post("/user/login")
        .send({
            email: "missing@weird.domain",
            password: "missinguserspassword"
        })
        .then(res => {
            assert(!res.body.success, "Missing user login succeeded.");
            assert(res.status >= 400, "Incorrect status.");
        })
    );

    it("Should fail for incorrect password", () => request(app)
        .post("/user/login")
        .send({
            email: TestUsers.Alfred.email,
            password: "wrongpassword"
        })
        .then(res => {
            assert(!res.body.success, "Incorrect password allowed.");
            assert(res.status >= 400, "Incorrect status.");
        })
    );

    it("Should allow a valid login", () => request(app)
        .post("/user/login")
        .send(TestUsers.Alfred)
        .then(res => {
            assert(res.body.success, "Correct login rejected.");
            assert(res.status == 200, "Status not 200 OK.");
        })
    );

    it("Should allow long emails", () => request(app)
        .post("/user/login")
        .send(TestUsers.Dominguez)
        .then(res => {
            assert(res.body.success, "Long email login rejected.");
            assert(res.status === 200, "Status not 200 OK.");
        })
    );
});

describe("GET /user/profile", () => {
    it("Should fail if unauthenticated", () => request(app)
        .get("/user/profile")
        .send()
        .then(res => {
            assert(res.status == 401, "Not unauthorised.");
        })
    );

    it("Should return the logged-in users's profile", () => request(app)
        .post("/user/login")
        .send(TestUsers.Alfred)
        .then(res => {
            assert(res.body.token, "Missing authorization token.");
            assert(res.status == 200, "Failed to log in");

            let token = res.body.token;
            request(app)
                .get("/user/profile")
                .set("Authorization", token)
                .send()
                .then(res => {
                    assert(res.body.success, "Profile request failed.");
                    assert(res.body.status == 200, "Status not 200 OK.");
                    assert(res.body.user?.name == "testuser", "Bad profile.");
                });
        })
    );
});
