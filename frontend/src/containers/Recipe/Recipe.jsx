import { useState, useEffect } from 'react';
import axios from '../../api/axios';

import { useParams } from 'react-router-dom';

import Header from '../../components/Header';
import Button from '../../components/Button';
import Tag from '../../components/Tag';
import Textfield from '../../components/Textfield';
import {
  ClockIcon,
  PersonIcon,
  LockIcon,
  GlobeIcon,
  TrashIcon,
  ListOrderedIcon,
  ListUnorderedIcon,
} from '@primer/octicons-react';
import ListTextArea from '../../components/ListTextArea';
import { recipesRoute } from '../../api/routes';

export default function Recipe(props) {
  let params = useParams();

  const [recipe, setRecipe] = useState(null);
  const [recipeLoading, setRecipeLoading] = useState(true);
  const [recipeError, setRecipeError] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      axios
        .get(recipesRoute(params.recipeId))
        .then((response) => {
          setRecipe(response.data.recipe);
          setRecipeLoading(false);
        })
        .catch((error) => setRecipeError(error));
    }
    fetchRecipes();
  }, [params.recipeId]);

  const editing = props.edit;

  // Inefficient but good enough.
  const cloneRecipe = () => {
    return JSON.parse(JSON.stringify(recipe));
  };

  const setIngredients = (ingredients) => {
    let clone = cloneRecipe();
    clone.ingredients = ingredients;
    setRecipe(clone);
  };
  const setSteps = (steps) => {
    let clone = cloneRecipe();
    clone.steps = steps;
    setRecipe(clone);
  };
  const setRecipeTitle = (title) => {
    let clone = cloneRecipe();
    clone.title = title;
    setRecipe(clone);
  };
  const setTimeHours = (hours) => {
    let clone = cloneRecipe();
    clone.time.hours = parseInt(hours);
    setRecipe(clone);
  };
  const setTimeMinutes = (minutes) => {
    let clone = cloneRecipe();
    clone.time.minutes = parseInt(minutes);
    setRecipe(clone);
  };
  const setServes = (serves) => {
    let clone = cloneRecipe();
    clone.servings = parseInt(serves);
    setRecipe(clone);
  };

  let [stepMode, setStepMode] = useState(true);
  let [ingredientMode, setIngredientMode] = useState(true);

  return (
    !recipeLoading &&
    !recipeError && (
      <div className="px-16 py-16 mx-auto container">
        {editing ? (
          <div className="max-w-xl mt-4">
            <Textfield
              params={{
                value: recipe.title,
                onChange: (e) => {
                  setRecipeTitle(e.target.value);
                },
              }}
              className="text-3xl"></Textfield>
          </div>
        ) : (
          <Header inline>{recipe.title}</Header>
        )}
        <span>
          {editing ? (
            <span>
              <label className="">
                <ClockIcon size={16} />
                <input
                  type="number"
                  value={recipe.time.hours}
                  min="0"
                  onChange={(e) => {
                    setTimeHours(e.target.value);
                  }}
                  className="bg-slate-100 appearance-none inline-block w-16 px-3 py-1.5 border border-solid rounded mx-2"
                />
                hours
                <input
                  type="number"
                  value={recipe.time.minutes}
                  min="0"
                  onChange={(e) => {
                    setTimeMinutes(e.target.value);
                  }}
                  className="bg-slate-100 appearance-none inline-block w-16 px-3 py-1.5 border border-solid rounded mx-2"
                />
                minutes
              </label>
              <label className="ml-4">
                <PersonIcon size={16} />

                <input
                  type="number"
                  value={recipe.servings}
                  min="1"
                  onChange={(e) => {
                    setServes(e.target.value);
                  }}
                  className="bg-slate-100 appearance-none inline-block w-40 px-3 py-1.5 border border-solid rounded ml-2"
                />
              </label>
              <label className="ml-4">
                {props.public ? (
                  <GlobeIcon size={16} />
                ) : (
                  <LockIcon size={16} />
                )}

                <select
                  name="publicity"
                  id="publicity"
                  className="bg-slate-100 appearance-none inline-block w-40 px-3 py-1.5 border border-solid rounded ml-2">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </label>
            </span>
          ) : (
            <span className="appearance-none inline-block w-96 py-1.5">
              {recipe.time?.hours && recipe.time.hours > 0
                ? recipe.time.hours +
                  ` hour${recipe.time.hours > 1 ? 's' : ''} `
                : null}
              {recipe.time?.minutes && recipe.time.minutes
                ? recipe.time.minutes +
                  ` minute${recipe.time.minutes > 1 ? 's ' : ' '}`
                : null}
              — Serves {recipe.servings}
            </span>
          )}
        </span>
        <span className="float-right">
          {editing ? (
            <Button
              primary={false}
              to={`/recipe/${params.recipeId}/`}
              className="leading-3 w-24">
              Save
            </Button>
          ) : (
            <Button primary={false} to="edit" className="leading-3 min-w-96">
              Edit
            </Button>
          )}
        </span>
        <span className="block mt-4 lg:mt-0 lg:inline lg:float-right">
          {editing
            ? recipe.tags.map((tag, i) => (
                <Tag key={i} className="cursor-pointer select-none">
                  <TrashIcon size={24} className={`pt-1.5 pb-0.5`} />
                  {tag}
                </Tag>
              ))
            : recipe.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
        </span>

        <hr className="my-8" />
        <main className="grid grid-cols-1 lg:grid-cols-2">
          <article>
            {/* <ListTextArea
              title={'Ingredients'}
              listElementsIcon={<ListUnorderedIcon size={24} />}
              listMode={ingredientMode}
              setListMode={setIngredientMode}
              items={recipe.ingredients}
              setItems={setIngredients}
              editing={editing}
              ordered={false}
            />
            <ListTextArea
              title={'Steps'}
              listElementsIcon={<ListOrderedIcon size={24} />}
              listMode={stepMode}
              setListMode={setStepMode}
              items={recipe.steps}
              setItems={setSteps}
              editing={editing}
              ordered={true}
            /> */}
          </article>
          <div>
            {editing ? (
              <div>
                <div className="relative group">
                  <img
                    src={recipe.primaryImage}
                    alt=""
                    className="object-cover w-full max-h-96 pb-12 mt-4 rounded group-hover:opacity-40"
                  />
                  <div className="hidden group-hover:block absolute top-4 right-4">
                    <TrashIcon
                      size={32}
                      className="box-content text-white cursor-pointer rounded-full bg-slate-800 hover:bg-red-900 p-5"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={recipe.primaryImage}
                alt=""
                className="object-cover w-full max-h-96 pb-12 mt-4 rounded"
              />
            )}
          </div>
        </main>
      </div>
    )
  );
}
