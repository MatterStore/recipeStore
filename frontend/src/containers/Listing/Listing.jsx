import { useState, useEffect } from "react";
import axios from "../../api/axios";

import { allRecipesRoute } from "../../api/routes";

import Header from "../../components/Header";
import Button from "../../components/Button";
import Recipe from "../../components/Recipe";
import Subheader from "../../components/Subheader";

export default function Listing() {
  // const [CollectionsData, setCollectionsData] = useState(null);
  // const [CollectionsLoading, setCollectionsLoading] = useState(true);
  // const [CollectionsError, setCollectionsError] = useState(null);

  const [recipesData, setRecipesData] = useState(null);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [recipesError, setRecipesError] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      axios
        .get(allRecipesRoute)
        .then((response) => {
          setRecipesData(response.data.list);
          setRecipesLoading(false);
        })
        .catch((error) => setRecipesError(error));
    }
    fetchRecipes();
  }, []);

  console.log({
    recipesData: recipesData,
    recipesLoading: recipesLoading,
    recipesError: recipesError,
  });

  // const recipes = fetch(usersRecipesRoute)
  //   .then((response) => response.json())
  //   .then((data) => console.log(data));
  // const recipes = [
  //   {
  //     id: "1",
  //     name: "Gnocchi",
  //     primaryImage:
  //       "https://unsplash.com/photos/Zmhi-OMDVbw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MXx8Z25vY2NoaXxlbnwwfHx8fDE2NjE2NzU5NjQ&w=400",
  //   },
  //   {
  //     id: "2",
  //     name: "Ratatouille",
  //     primaryImage:
  //       "https://unsplash.com/photos/3vDJ--i7w88/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8M3x8cmF0YXRvdWlsbGV8ZW58MHx8fHwxNjYxNjc2MDY0&w=400",
  //   },
  // ];

  // const collections = {
  //   "Your Recipe Collection": [1, 2],
  //   "Easy Dinners": [1],
  // };

  return (
    <div>
      <main className="p-16 mx-auto max-w-screen-sm lg:max-w-screen-2xl flex flex-col">
        <Header>
          Recipes
          <span className="block mt-8 lg:mt-0 lg:inline-block lg:float-right">
            <Button to="/recipe/new" primary={true}>
              New Recipe
            </Button>
          </span>
        </Header>
        {!recipesLoading && !recipesError && (
          <>
            <div
              className="mt-4 mb-12 self-center lg:self-start w-full"
              key={1}
            >
              <Subheader key={1}>
                {"Your Recipe Collection"}
                {/* <Link
                  to={`/collection/${"Your Recipe Collection"}`}
                  className={`ml-8 text-lg underline subpixel-antialiased text-purple-600 whitespace-pre-wrap`}
                >
                  View All
                </Link> */}
              </Subheader>
              <div className="self-center lg:self-start">
                {recipesData.map((recipe) => (
                  <div
                    className="mx-auto inline-block"
                    key={recipe.title + `-${recipe._id}`}
                  >
                    <Recipe {...recipe} />
                  </div>
                ))}
              </div>
            </div>
            {/* {Object.entries(collections).map(
              ([collectionName, collectionRecipes], i) => {
                return (
                  <div
                    className="mt-4 mb-12 self-center lg:self-start w-full"
                    key={i}
                  >
                    <Subheader key={i}>
                      {collectionName}
                      <Link
                        to={`/collection/${collectionName}`}
                        className={`ml-8 text-lg underline subpixel-antialiased text-purple-600 whitespace-pre-wrap`}
                      >
                        View All
                      </Link>
                    </Subheader>
                    <div className="self-center lg:self-start">
                      {collectionRecipes
                        .map((index) => recipesData[index - 1])
                        .map((recipe, j) => {
                          return (
                            <div
                              className="mx-auto inline-block"
                              key={recipe.name + ` ${i} ${j}`}
                            >
                              <Recipe {...recipe} />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              }
            )} */}
          </>
        )}
      </main>
    </div>
  );
}
