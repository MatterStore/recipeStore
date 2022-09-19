# API Specification

See _Design Documentation > Backend > API Documentation_ on Confluence for a
diagram.

## Format

Endpoints should specify their request method and format. Request formats can
be specified in a JSON-like schema with JS typing, with a trailing `?` on a
type (e.g. `string?`) indicating an optional field. Any non-type requirements
e.g. authorization, should also be specified.

## Authorisation

Many endpoints require authentication. This is performed using the
`Authorization` HTTP header with the token returned by the `/user/login`
endpoint. This token starts with `JWT ` followed by a unique authorisation
token. Including the header

```
Authorization: JWT TOKEN
```

With a valid login will allow access to endpoints requiring authentication.

## Common Objects

Some objects appear in responses from multiple endpoints, so they are included
here to avoid duplication.

- **Simple Response**, JSON with a boolean indicating whether the request was
  successful (`success`) and a string describing the outcome (`msg`).
  ```
  { success: boolean, msg: string }
  ```
- **User**
  ```
  {
      id: string,
      email: string,
      name: string,
      admin: boolean
  }
  ```
- **Recipe**
  ```
  {
      id: string,
      user: string,
      title: string,
      cooking_time: string?,
      servings: number?,
      ingredients: [
          {
              text: string,
              name: string?,
              quantity: string?,
              unit: string?
          }
      ],
      steps: [string],
      tags: [string],
      public: boolean
  }
  ```
- **Collection**
  ```
  {
      id: string.
      user: string,
      name: string,
      tags: [string],
      recipes: [string],
      public: boolean
  }
  ```

## Endpoints

- `/collections`
  - `POST /collections/new`
    - Requires authentication.
    - Creates a new collection stored under the logged in user's account.
    - Accepts a JSON body of the form
      ```
      {
          name: string,
          tags: [string],
          recipes: [string],
          public: boolean?
      }
      ```
    - Here, all entries in `recipes` must be valid MongoDB ObjectIDs, as
      these are the identifying keys of recipes.
    - If not included, `public` defaults to `false`.
    - Returns a **Simple Response**.
  - `GET /collections/all`
    - Requires authentication.
    - Lists collections owned by the logged in user.
    - Returns a JSON response of the form
      ```
      {
          success: boolean,
          msg: string,
          list: [Collection]
      }
      ```
  - `GET /collections/all/public`
    - Returns a list of all public collections.
    - Response of the same form as `GET collections/all`.
  - `GET /collections/:id`
    - Requires authentication.
    - Finds details of a collection by ID (`:id`).
    - Will succeed, returning the collection if the collection is owned by
      the authenticated user or the collection is public.
    - On failure, returns a **Simple Response**.
    - If successful, returns a document like
      ```
      {
          success: boolean,
          msg: string,
          collection: Collection
      }
      ```
  - `DELETE /collections/:id`
    - Requires authentication.
    - Deletes a collection owned by the authenticated user.
    - Returns a **Simple Response**.
  - `PATCH /collections/:id`
    - Requires authentication.
    - Updates a collection owned by the authenticated user.
    - Returns a **Simple Response**.
  - `POST /collections/:id/add`
    - Requires authentication.
    - Adds recipes to the collection. Recipes specified in a JSON body with
      an array of recipe IDs.
      ```
      { recipes: [string] }
      ```
    - Returns a **Simple Response**.
  - `POST /collections/:id/remove`
    - Requires authentication.
    - Removes recipes to the collection. Recipes specified in a JSON body
      with an array of recipe IDs.
      ```
      { recipes: [string] }
      ```
    - Returns a **Simple Response**.
- `/recipes`
  - `POST /recipes/new`
    - Requires authentication.
    - Create a new recipe.
    - Accepts a JSON body of the form
      ```
      {
          title: string,
          cooking_time: string,
          servings: number,
          ingredients: [
              {
                  text: string,
                  name: string?,
                  quantity: string?,
                  unit: string?
              }
          ],
          steps: [string],
          tags: [string],
          public: bool?
      }
      ```
  - `GET /recipes/all`
    - Requires authentication.
    - Finds all recipes owned by the logged in user.
    - Returns a response with an array of recipe objects of the form
      ```
      {
          success: boolean,
          msg: string,
          list: [Recipe]
      }
      ```
  - `GET /recipes/all/public`
    - Requires authentication.
    - Returns a list of all public recipes.
    - Returns the same form of response as `GET /recipes/all`.
  - `GET /recipes/:id`
    - Requires authentication.
    - Find a specific recipe, which must be owned by the logged in user or
      public.
    - Returns a **Simple Response** on failure.
    - On success, returns a JSON body like
      ```
      {
          success: boolean,
          msg: string,
          recipe: Recipe
      }
      ```
  - `DELETE /recipes/:id`
    - Requires authentication.
    - Delete a recipe by ID.
    - Returns a **Simple Response**.
  - `PATCH /recipes/:id`
    - Requires authentication.
    - Update a recipe by ID.
    - Accepts a JSON body with any of the fields from `/recipes/new`.
    - Returns a **Simple Response**.
- `/user`
  - `POST /user/signup`
    - Signs up a new user if valid details were supplied.
    - Accepts a JSON body of the form
      ```
      {
          email: string,
          password: string,
          name: string
      }
      ```
    - `email` must be a valid email address.
    - `password` must be 8-20 characters.
    - `name` must be 2-40 characters.
    - Returns a **Simple Response**.
  - `POST /user/login`
    - Authenticates a user.
    - Accepts a JSON body subject, subject to the same field restrictions
      as `/user/signup` of the form
      ```
      { email: string, password: string }
      ```
    - On failure, returns a **Simple Response**.
    - On success, replies with a JSON body of the form
      ```
      {
          success: boolean,
          msg: string,
          token: string,
          user: User
      }
      ```
    - `token` is a JWT authorization token, to be sent as the
      `Authorization` HTTP header.
  - `GET /user/profile`
    - Requires authorization.
    - Returns details for the logged in user, in JSON like so
      ```
      {
          success: boolean,
          user: User
      }
      ```
  - `POST /user/update-password`
    - Requires authentication.
    - Accepts a JSON body of the form
      ```
      {
          email: string,
          currentPassword: string,
          newPassword: string,
          newConfirmPassword: string
      }
      ```
    - `email` is the users email address, must be a valid email.
    - `currentPassword` is the users existing password.
    - `newPassword` and `newConfirmPassword` must be the same string and
      must be 8-20 characters.
    - Returns a **Simple Response**.
