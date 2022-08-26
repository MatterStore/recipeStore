# API Specification

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
                    text: string,
                    name: string?,
                    quantity: string?,
                    unit: string?
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
                        text: string,
                        name: string?,
                        quantity: string?,
                        unit: string?
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
