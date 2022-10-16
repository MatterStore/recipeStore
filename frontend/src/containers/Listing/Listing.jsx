import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';

import { allRecipesRoute, allCollectionsRoute } from '../../api/routes';

import Header from '../../components/Header';
import Button from '../../components/Button';
import Recipe from '../../components/Recipe';
import Subheader from '../../components/Subheader';

export default function Listing() {
  const [collectionsData, setCollectionsData] = useState(null);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [collectionsError, setCollectionsError] = useState(null);

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
          setRecipesLoading(false);
        })
        .catch((error) => setRecipesError(error));
    }
    fetchRecipes();
  }, []);

  useEffect(() => {
    async function fetchCollections() {
      axios
        .get(allCollectionsRoute)
        .then((response) => {
          setCollectionsData(response.data.list);
          setCollectionsLoading(false);
        })
        .catch((error) => setCollectionsError(error));
    }
    fetchCollections();
  }, []);

  console.log(collectionsData);

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
        <div>
          {availableTags.map((tag) => (
            <span
              className={`text-xs inline-block box-content py-1.5 px-4 mr-4 text-md text-slate-900 rounded-full whitespace-nowrap max-w-fit hover:cursor-pointer
                              ${
                                tagFilters.includes(tag)
                                  ? 'bg-amber-400'
                                  : 'bg-gray-100 '
                              }
                              `}
              onClick={() =>
                tagFilters.includes(tag)
                  ? setTagFilters(tagFilters.filter((t) => t != tag))
                  : setTagFilters([...tagFilters, tag])
              }>
              {tag}
            </span>
          ))}
        </div>
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
            {!collectionsLoading &&
              collectionsData.map((collection) => {
                return (
                  <div
                    className="mt-4 mb-12 self-center lg:self-start w-full"
                    key={collection._id}>
                    <Subheader key={collection._id}>
                      {collection.name}
                      <Link
                        to={`/collection/${collection.name}`}
                        className={`ml-8 text-lg underline subpixel-antialiased text-purple-600 whitespace-pre-wrap`}>
                        View All
                      </Link>
                    </Subheader>
                    <div className="self-center lg:self-start">
                      {collection.recipes.map((collectionRecipe) =>
                        recipesData
                          .filter((recipe) => recipe._id === collectionRecipe)
                          .map((recipe) => {
                            return (
                              <div
                                className="mx-auto inline-block"
                                key={recipe.name + ``}>
                                <Recipe {...recipe} />
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </main>
    </div>
  );
}
