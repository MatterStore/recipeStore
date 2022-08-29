# API Specification

See *Design Documentation > Backend > API Documentation* on Confluence for a
diagram.

## Format

Endpoints should specify their request method and format. Request formats can
be specified in a JSON-like schema with JS typing, with a trailing `?` on a
type (e.g. `string?`) indicating an optional field. Any non-type requirements
e.g. authorization, should also be specified.

## Endpoints

* `/recipes`
    * `POST /recipes/new`
        * Requires authentication.
        * Create a new recipe.
        * Accepts a JSON body of the form
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
    * `GET /recipes/all`
        * Requires authentication.
        * Finds all recipes owned by the logged in user.
        * Returns an array of recipe objects of the form
            ```
            [
                {
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
            ]
            ``` 
    * `GET /recipes/:id`
        * Requires authentication.
        * Find a specific recipe, which must be owned by the logged in user or
            public.
        * Returns a recipe object as above.
* `/user`
    * `POST /user/signup`
        * Signs up a new user if valid details were supplied.
        * Accepts a JSON body of the form
            ```
            {
                email: string,
                password: string,
                name: string
            }
            ```
        * `email` must be a valid email address.
        * `password` must be 8-20 characters.
        * `name` must be 2-40 characters.
        * Returns a JSON body like so
            ```
            { success: boolean, msg: string }
            ```
        * Where `msg` is a string with details about the requests status.
    * `POST /user/login`
        * Authenticates a user.
        * Accepts a JSON body subject, subject to the same field restrictions
            as `/user/signup` of the form
            ```
            { email: string, password: string }
            ```
        * On failure, returns a JSON body of the same format as `/user/signup`.
        * On success, replies with a JSON body of the form
            ```
            {
                success: boolean,
                msg: string,
                token: string,
                user: {
                    id: string,
                    email: string,
                    name: string,
                    admin: boolean
                }
            }
            ```
        * `token` is a JWT authorization token, to be sent as the
            `Authorization` HTTP header.
    * `GET /user/profile`
        * Requires authorization.
        * Returns details for the logged in user, in JSON like so
            ```
            {
                success: boolean,
                user: {
                    id: string,
                    email: string,
                    name: string,
                    admin: boolean
                }
            }
            ```
    * `POST /user/update-password`
        * Requires authorization.
        * Accepts a JSON body of the form
            ```
            {
                email: string,
                currentPassword: string,
                newPassword: string,
                newConfirmPassword: string
            }
            ```
        * `email` is the users email address, must be a valid email.
        * `currentPassword` is the users existing password.
        * `newPassword` and `newConfirmPassword` must be the same string and
            must be 8-20 characters.
        * Returns a JSON response of the form
            ```
            { success: boolean, msg: string }
            ```
