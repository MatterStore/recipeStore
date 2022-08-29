import request from "supertest";
import { assert } from "chai";

import app from '../app.js';
import User from "../models/user.js";

// Clear users collection of test DB before and after tests
before(() => User.deleteMany({}));
after(() => User.deleteMany({}));

describe("POST /user/signup", () => {
    it("Should register a new user", () => request(app)
        .post("/user/signup")
        .send({
            email: "test@test.domain",
            name: "testuser",
            password: "testpassword"
        })
        .then((res) => {
            assert(res.body.success, "Signup failed.");
            assert(res.status === 200, "Signup not 200 OK.");
        })
    );

    it("Should prevent duplicate emails", () => request(app)
        .post("/user/signup")
        .send({
            email: "test@test.domain",
            name: "testuser",
            password: "testpassword"
        })
        .then((res) => {
            assert(!res.body.success, "Duplicate email allowed.");
            assert(res.status === 422, "Signup not error code.");
        })
    )
});

describe("POST /user/login", () => {
    it("Should fail for missing user", () => request(app)
        .post("/user/login")
        .send({
            email: "missing@weird.domain",
            password: "missinguserspassword"
        })
        .then((res) => {
            assert(!res.body.success, "Missing user login succeeded.");
            assert(res.status >= 400, "Incorrect status.");
        })
    );

    it("Should fail for incorrect password", () => request(app)
        .post("/user/login")
        .send({
            email: "test@test.domain",
            password: "wrongpassword"
        })
        .then((res) => {
            assert(!res.body.success, "Incorrect password allowed.");
            assert(res.status >= 400, "Incorrect status.");
        })
    );

    it("Should allow a valid login", () => request(app)
        .post("/user/login")
        .send({
            email: "test@test.domain",
            password: "testpassword"
        })
        .then((res) => {
            assert(res.body.success, "Correct login rejected.");
            assert(res.status == 200, "Status not 200 OK.");
        })
    );
});
