import { useState, useEffect } from 'react';
import axios from '../../api/axios';

import { allRecipesRoute } from '../../api/routes';

import Header from '../../components/Header';
import Button from '../../components/Button';
import Recipe from '../../components/Recipe';
import Subheader from '../../components/Subheader';

export default function Listing() {
  // const [CollectionsData, setCollectionsData] = useState(null);
  // const [CollectionsLoading, setCollectionsLoading] = useState(true);
  // const [CollectionsError, setCollectionsError] = useState(null);

  const [recipesData, setRecipesData] = useState(null);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [recipesError, setRecipesError] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [tagFilters, setTagFilters] = useState([]);

  useEffect(() => {
    async function fetchRecipes() {
      axios
        .get(allRecipesRoute)
        .then((response) => {
          setRecipesData(response.data.list);
          setAvailableTags([
            ...new Set(response.data.list.flatMap((recipe) => recipe.tags)),
          ]);
          console.log(availableTags);
          setRecipesLoading(false);
        })
        .catch((error) => setRecipesError(error));
    }
    fetchRecipes();
  }, []);

  return (
    <div>
      <main className="p-16 mx-auto container flex flex-col">
        <Header>
          Recipes
          <span className="block mt-8 lg:mt-0 lg:inline-block lg:float-right">
            <Button to="/recipe/new" primary={true} className="mr-0">
              New Recipe
            </Button>
          </span>
        </Header>
        <span>
          Select tags to filter by clicking on them!
          {availableTags.map((tag) => (
            <div
              onClick={() =>
                tagFilters.includes(tag)
                  ? setTagFilters(tagFilters.filter((t) => t != tag))
                  : setTagFilters([...tagFilters, tag])
              }>
              {tag}
            </div>
          ))}
        </span>
        {!recipesLoading && !recipesError && (
          <>
            <div
              className="mt-4 mb-12 self-center lg:self-start w-full"
              key={1}>
              <Subheader key={1}>
                {'Your Recipe Collection'}
                {/* <Link
                  to={`/collection/${"Your Recipe Collection"}`}
                  className={`ml-8 text-lg underline subpixel-antialiased text-purple-600 whitespace-pre-wrap`}
                >
                  View All
                </Link> */}
              </Subheader>
              <div className="self-center lg:self-start">
                {recipesData
                  .filter(
                    (recipe) =>
                      tagFilters.length < 1 ||
                      //every tag in filters is included in this recipe, i.e AND functionality
                      tagFilters.every((fltr) => recipe.tags.includes(fltr))
                  )
                  .map((recipe) => (
                    <div
                      className="mx-auto inline-block"
                      key={recipe.title + `-${recipe._id}`}>
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
