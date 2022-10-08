import { useState } from "react"
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Tag from "../../components/Tag";
import Textfield from "../../components/Textfield";
import {
  ClockIcon,
  PersonIcon,
  LockIcon,
  GlobeIcon,
  TrashIcon,
  ListOrderedIcon,
  ListUnorderedIcon
} from '@primer/octicons-react'
import ListTextArea from "../../components/ListTextArea";
import Ellipsis from "../../components/Ellipsis";

export default function Recipe(props) {
  let params = useParams();

  const editing = props.edit;

  const recipeDummyData = [
    {
      id: '1',
      name: 'Gnocchi',
      primaryImage:
        "https://unsplash.com/photos/Zmhi-OMDVbw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MXx8Z25vY2NoaXxlbnwwfHx8fDE2NjE2NzU5NjQ&w=600",
      ingredients: ["100g Flour", "1tspn Sugar"],
      steps: ["Mix the flour with the sugar", "Serve and enjoy!"],
      tags: ["Vegetarian"],
      time: {
        hours: 3,
        minutes: 0
      },
      servings: 4,
    },
    {
      id: '2',
      name: 'Ratatouille',
      primaryImage:
        "https://unsplash.com/photos/3vDJ--i7w88/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8M3x8cmF0YXRvdWlsbGV8ZW58MHx8fHwxNjYxNjc2MDY0&w=600",
      ingredients: ["250g Pumpkin", "500mL Water"],
      steps: ["Pour the water onto the pumpkin", "Serve and enjoy!"],
      tags: ["Anton Ego Approved", "Gluten Free"],
      time: {
        hours: 0,
        minutes: 15
      },
      servings: 8,
    },
  ];

  // Inefficient but good enough.
  const cloneRecipe = () => {
    return JSON.parse(JSON.stringify(recipe));
  }

  const setIngredients = (ingredients) => {
    let clone = cloneRecipe();
    clone.ingredients = ingredients;
    setRecipe(clone);
  }
  const setSteps = (steps) => {
    let clone = cloneRecipe();
    clone.steps = steps;
    setRecipe(clone);
  }
  const setRecipeName = (name) => {
    let clone = cloneRecipe();
    clone.name = name;
    setRecipe(clone);
  }
  const setTimeHours = (hours) => {
    let clone = cloneRecipe();
    clone.time.hours = parseInt(hours);
    setRecipe(clone);
  }
  const setTimeMinutes = (minutes) => {
    let clone = cloneRecipe();
    clone.time.minutes = parseInt(minutes);
    setRecipe(clone);
  }
  const setServes = (serves) => {
    let clone = cloneRecipe();
    clone.servings = parseInt(serves);
    setRecipe(clone);
  }

  const getRecipe = (recipeId) => {
    return recipeDummyData[recipeId - 1];
  };

  let [stepMode, setStepMode] = useState(true);
  let [ingredientMode, setIngredientMode] = useState(true);

  const [recipe, setRecipe] = useState(getRecipe(params.recipeId));

  return (
    <div className="px-16 py-16 mx-auto container">
      {
        editing ? (
          <div className="max-w-xl mt-4">
            <Textfield params={{value: recipe.name, onChange: (e) => {setRecipeName(e.target.value)}}} className="text-3xl"></Textfield>
          </div>
        ) : (
          <Header inline>{recipe.name}</Header>
        )
      }
      <div className="flex flex-row w-full">
        <span>
          { editing ? (
            <span>
              <label className="">
                <ClockIcon size={16} />
                <input type="number" value={recipe.time.hours} min="0" onChange={(e)=>{setTimeHours(e.target.value)}} className="bg-slate-100 appearance-none inline-block w-16 px-3 py-1.5 border border-solid rounded mx-2" />
                hours
                <input type="number" value={recipe.time.minutes} min="0" onChange={(e)=>{setTimeMinutes(e.target.value)}} className="bg-slate-100 appearance-none inline-block w-16 px-3 py-1.5 border border-solid rounded mx-2" />
                minutes
              </label>
              <label className="ml-4">
                <PersonIcon size={16} />

                <input type="number" value={recipe.servings} min="1" onChange={(e)=>{setServes(e.target.value)}} className="bg-slate-100 appearance-none inline-block w-40 px-3 py-1.5 border border-solid rounded ml-2" />

              </label>
              <label className="ml-4">
                { props.public ? (<GlobeIcon size={16} />) : (<LockIcon size={16} />)}
                
                <select name="publicity" id="publicity" className="bg-slate-100 appearance-none inline-block w-40 px-3 py-1.5 border border-solid rounded ml-2">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </label>
              
            </span>
          ) : (
            <span className="appearance-none inline-block py-1.5">
              {recipe.time.hours > 0 ? 
                recipe.time.hours + ` hour${recipe.time.hours > 1 ? 's' : ''} `
              : null}{
              (recipe.time.minutes ?
                recipe.time.minutes + ` minute${recipe.time.minutes > 1 ? 's ' : ' '}` : null)}
              — Serves {recipe.servings}
            </span>
          )}
        </span>
        <span className="ml-auto">
          { editing ? (
            <Button primary={false} to={`/recipe/${params.recipeId}/`} className="leading-3 w-24">
              Save
            </Button>
          ) : (
            <></>
            // <Button primary={false} to="edit" className="leading-3 min-w-96">
            //   Edit
            // </Button>
          )}
        </span>
        <div>
          {editing ? (
            recipe.tags.map((tag, i) => (
              <Tag key={i} className="cursor-pointer select-none">
                <TrashIcon size={24} className={`pt-1.5 pb-0.5`}/>  
                {tag}
              </Tag>
            ))
          ) : (
            recipe.tags.map((tag, i) => (
              <Tag key={i}>{tag}</Tag>
            ))
              //  <span primary={false} to="" className="leading-3 font-bold mb-4 text-slate-600 cursor-pointer select-none rounded hover:bg-slate-200">
              //   Save to collection
              // </span>
          )}
        </div>
        <div>
          <Ellipsis />
        </div>
      </div>

      <hr className="my-8" />
      <main className="grid grid-cols-1 lg:grid-cols-2">
        <article>
          <ListTextArea
            title={"Ingredients"}
            listElementsIcon={(<ListUnorderedIcon size={24} />)}
            listMode={ingredientMode}
            setListMode={setIngredientMode}
            items={recipe.ingredients}
            setItems={setIngredients}
            editing={editing}
            ordered={false}
          />
          <ListTextArea
            title={"Steps"}
            listElementsIcon={(<ListOrderedIcon size={24} />)}
            listMode={stepMode}
            setListMode={setStepMode}
            items={recipe.steps}
            setItems={setSteps}
            editing={editing}
            ordered={true}
          />
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
                  <TrashIcon size={32} className="box-content text-white cursor-pointer rounded-full bg-slate-800 hover:bg-red-900 p-5"/>
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
  );
}
