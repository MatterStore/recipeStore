import request from "supertest";
import { assert } from "chai";

import app from '../app.js';
import User from "../models/user.js";

describe("POST /user/signup", () => {
    before(() => User.deleteMany({}));

    it("Should register a new user", () => request(app)
        .post("/user/signup")
        .send({
            email: "test@gmail.com",
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
            email: "test@gmail.com",
            name: "testuser",
            password: "testpassword"
        })
        .then((res) => {
            assert(!res.body.success, "Duplicate email allowed.");
            assert(res.status === 422, "Signup not error code.");
        })
    )

    after(() => User.deleteMany({}));
});
