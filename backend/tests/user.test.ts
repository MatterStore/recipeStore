import request from "supertest";
import { assert } from "chai";

import app from "../app.js";
import User from "../models/user.js";
import { assertFailed, assertSucceeded } from "./helpers.js";

// Note: the /user tests delete @test.domain users as part of the tests, so
// best not to use these for other tests.
const TestUsers = {
  Alfred: {
    email: "test@test.domain",
    name: "alfred",
    password: "testpassword",
  }, // Used for /user
  Dominguez: {
    email: "testuserwithoverlylongemail@test.domain",
    name: "longnametestuser",
    password: "testpassword0",
  }, // Used for /user
};

// Clear users collection of test DB before and after tests
const clearTestUsers = () =>
  User.deleteMany({
    email: { $regex: /.*@test\.domain$/ },
  });
before(clearTestUsers);
after(clearTestUsers);

describe("POST /user/signup", () => {
  it("Should register a new user", () =>
    request(app)
      .post("/user/signup")
      .send(TestUsers.Alfred)
      .then((res) => assertSucceeded(res, "Signup failed.")));

  it("Should prevent duplicate emails", () =>
    request(app)
      .post("/user/signup")
      .send(TestUsers.Alfred)
      .then((res) => assertFailed(res, "Duplicate email allowed.")));

  it("Should work with long emails", () =>
    request(app)
      .post("/user/signup")
      .send(TestUsers.Dominguez)
      .then((res) => assertSucceeded(res, "Long email signup failed.")));
});

describe("POST /user/login", () => {
  it("Should fail for missing user", () =>
    request(app)
      .post("/user/login")
      .send({
        email: "missing@weird.domain",
        password: "missinguserspassword",
      })
      .then((res) => assertFailed(res, "Missing user login succeeded.")));

  it("Should fail for incorrect password", () =>
    request(app)
      .post("/user/login")
      .send({
        email: TestUsers.Alfred.email,
        password: "wrongpassword",
      })
      .then((res) => assertFailed(res, "Incorrect password allowed.")));

  it("Should allow a valid login", () =>
    request(app)
      .post("/user/login")
      .send(TestUsers.Alfred)
      .then((res) => assertSucceeded(res, "Correct login rejected.")));

  it("Should allow long emails", () =>
    request(app)
      .post("/user/login")
      .send(TestUsers.Dominguez)
      .then((res) => assertSucceeded(res, "Long email login rejected.")));
});

describe("GET /user/profile", () => {
  it("Should fail if unauthenticated", () =>
    request(app)
      .get("/user/profile")
      .send()
      .then((res) => assert(res.status == 401, "Not unauthorised.")));

  it("Should return the logged-in users's profile", () =>
    request(app)
      .post("/user/login")
      .send(TestUsers.Alfred)
      .then(async (res) => {
        assert(res.body.token, "Missing authorization token.");
        assert(res.status == 200, "Failed to log in");

        let token = res.body.token;
        await request(app)
          .get("/user/profile")
          .set("Authorization", token)
          .send()
          .then((res) => {
            assertSucceeded(res, "Profile request failed.");
            assert(
              res.body.user?.name == TestUsers.Alfred.name,
              "Bad profile."
            );
          });
      }));
});
