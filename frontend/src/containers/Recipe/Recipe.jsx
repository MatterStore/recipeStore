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
  DeviceCameraIcon,
} from '@primer/octicons-react';
import ListTextArea from '../../components/ListTextArea';
import FloatingMenuParent from '../../components/floating-menu/FloatingMenuParent';
import FloatingMenu from '../../components/floating-menu/FloatingMenu';
import MenuEntry from '../../components/floating-menu/MenuEntry';
import ParentMenuEntry from '../../components/floating-menu/ParentMenuEntry';
import { useNavigate } from 'react-router-dom';
import { newRecipeRoute, recipesRoute, listingRoute } from '../../api/routes';

export default function Recipe(props) {
  let params = useParams();

  const navigate = useNavigate();
  const [recipeError, setRecipeError] = useState(null);
  const [formValid, setFormValid] = useState(false);

  const defaultRecipe = {
    tags: [],
    servings: 1,
    time: {
      hours: 0,
      minutes: 0,
    },
    ingredients: [],
    steps: [],
    images: [],
  };

  const [recipe, setRecipe] = useState(props.new ? defaultRecipe : null);
  const [recipeLoading, setRecipeLoading] = useState(!props.new);

  const selectImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = function () {
        addImage(reader.result);
      };
    }
  };

  const editing = props.edit || props.new;

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
  const setPublic = (state) => {
    let clone = cloneRecipe();
    clone.public = state === 'public';
    setRecipe(clone);
  };
  const addImage = (image) => {
    let clone = cloneRecipe();
    clone.images.push(image);
    setRecipe(clone);
    console.log(clone);
  };

  let [stepMode, setStepMode] = useState(true);
  let [ingredientMode, setIngredientMode] = useState(true);

  const handleValidation = (event) => {
    let formIsValid = true;
    setFormValid(formIsValid);
  };

  useEffect(() => {
    async function fetchRecipes() {
      axios
        .get(recipesRoute(params.recipeId))
        .then((response) => {
          response.data.recipe.ingredients =
            response.data.recipe.ingredients.map(
              (ingredient) => ingredient.text
            );
          setRecipe(response.data.recipe);
          setRecipeLoading(false);
        })
        .catch((error) => setRecipeError(error));
    }
    if (!props.new) {
      fetchRecipes();
    }
  }, [params.recipeId, props.new]);

  const recipeSubmit = (e) => {
    // e.preventDefault();
    handleValidation();

    if (formValid) {
      axios
        .patch(recipesRoute(params.recipeId), {
          title: recipe.title,
          time: { hours: recipe.time.hours, minutes: recipe.time.minutes },
          servings: recipe.servings,
          ingredients: recipe.ingredients.map((ingredient) => ({
            text: ingredient,
          })),
          images: recipe.images,
          steps: recipe.steps,
          public: recipe.public,
        })
        .then(function (response) {
          navigate(`/recipe/${params.recipeId}`);
        })
        .catch(function (error) {});
    }
  };

  const newRecipe = (e) => {
    // e.preventDefault();
    handleValidation();

    if (formValid) {
      axios
        .post(newRecipeRoute, {
          title: recipe.title,
          time: { hours: recipe.time.hours, minutes: recipe.time.minutes },
          servings: recipe.servings,
          ingredients: recipe.ingredients.map((ingredient) => ({
            text: ingredient,
          })),
          images: recipe.images,
          steps: recipe.steps,
          public: recipe.public,
          tags: recipe.tags,
        })
        .then(function (response) {
          navigate(`/recipe/${response.data.id}`);
        })
        .catch(function (error) {});
    }
  };

  const deleteRecipe = () => {
    axios
      .delete(recipesRoute(params.recipeId))
      .then(function (response) {
        navigate(listingRoute);
      })
      .catch(function (error) {});
  };

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
        <div className="flex flex-row w-full">
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
                  {recipe.public ? (
                    <GlobeIcon size={16} />
                  ) : (
                    <LockIcon size={16} />
                  )}

                  <select
                    name="publicity"
                    id="publicity"
                    onChange={(e) => {
                      setPublic(e.target.value);
                    }}
                    className="bg-slate-100 appearance-none inline-block w-40 px-3 py-1.5 border border-solid rounded ml-2"
                    defaultValue={recipe.public ? 'public' : 'private'}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </label>
              </span>
            ) : (
              <span className="appearance-none inline-block py-1.5">
                {recipe.time.hours > 0
                  ? recipe.time.hours +
                    ` hour${recipe.time.hours > 1 ? 's' : ''} `
                  : null}
                {recipe.time.minutes
                  ? recipe.time.minutes +
                    ` minute${recipe.time.minutes > 1 ? 's ' : ' '}`
                  : null}
                — Serves {recipe.servings}
              </span>
            )}
          </span>

          <div className="ml-auto">
            {editing
              ? recipe.tags.map((tag, i) => (
                  <Tag key={i} className="cursor-pointer select-none">
                    <TrashIcon size={24} className={`pt-1.5 pb-0.5`} />
                    {tag}
                  </Tag>
                ))
              : recipe.tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)}
          </div>
          <div>
            {editing ? (
              <Button
                to=""
                className="mr-0"
                primary={true}
                onClick={() => (props.edit ? recipeSubmit() : newRecipe())}>
                Save
              </Button>
            ) : null}
          </div>
          {!editing ? (
            <div>
              <FloatingMenuParent label={'...'}>
                <FloatingMenu>
                  <MenuEntry
                    onClick={() => {
                      navigate('edit');
                    }}>
                    Edit Recipe
                  </MenuEntry>
                  <ParentMenuEntry name="Add to Collection">
                    <MenuEntry>New Collection</MenuEntry>
                    <hr />
                    {['🇬🇷 Greek', '🍕 Pizzas', '🥩 Meat lovers', '🇹🇭 Thai'].map(
                      (name) => {
                        return <MenuEntry key={name}>{name}</MenuEntry>;
                      }
                    )}
                  </ParentMenuEntry>
                  <MenuEntry onClick={deleteRecipe}>Delete Recipe</MenuEntry>
                </FloatingMenu>
              </FloatingMenuParent>
            </div>
          ) : null}
        </div>

        <hr className="my-8" />
        <main className="grid grid-cols-1 lg:grid-cols-2">
          <article>
            <ListTextArea
              title={'Ingredients'}
              listElementsIcon={<ListUnorderedIcon size={24} />}
              listMode={ingredientMode}
              setListMode={setIngredientMode}
              items={recipe.ingredients}
              setItems={setIngredients}
              editing={editing}
              ordered={false}
              addText={'Add ingredient'}
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
              addText={'Add step'}
            />
          </article>
          <div className="grid gap-4 pl-4 grid-cols-2 justify-center">
            {editing ? (
              <label className="border-gray-700 border-2 box-border rounded-xl aspect-square bg-gray-100 border-dashed flex justify-center items-center">
                <DeviceCameraIcon size="32" className="text-gray-700" />
                <input
                  className="hidden"
                  onInput={selectImageUpload}
                  type="file"
                  accept="image/*;capture=camera"
                />
              </label>
            ) : null}
            {recipe.images.map((image, i) => {
              return (
                <img
                  key={i}
                  className="rounded box-border"
                  src={image}
                  alt="Food photo"
                />
              );
            })}
          </div>
        </main>
      </div>
    )
  );
}
