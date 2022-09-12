import { useState } from "react"
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Tag from "../../components/Tag";
import Textfield from "../../components/Textfield";
import {ClockIcon, PersonIcon, LockIcon, GlobeIcon, TrashIcon} from '@primer/octicons-react'

export default function Recipe(props) {
  let params = useParams();

  const editing = props.edit;

  const [recipes, setRecipes] = useState([
    {
      id: "1",
      name: "Gnocchi",
      primaryImage:
        "https://unsplash.com/photos/Zmhi-OMDVbw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MXx8Z25vY2NoaXxlbnwwfHx8fDE2NjE2NzU5NjQ&w=600",
      ingredients: ["100g Flour", "1tspn Sugar"],
      steps: ["Mix the flour with the sugar", "Serve and enjoy!"],
      tags: ["Vegetarian"],
      time: "3 hours",
      servings: 4,
    },
    {
      id: "2",
      name: "Ratatouille",
      primaryImage:
        "https://unsplash.com/photos/3vDJ--i7w88/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8M3x8cmF0YXRvdWlsbGV8ZW58MHx8fHwxNjYxNjc2MDY0&w=600",
      ingredients: ["250g Pumpkin", "500mL Water"],
      steps: ["Pour the water onto the pumpkin", "Serve and enjoy!"],
      tags: ["Anton Ego Approved", "Gluten Free"],
      time: "15 minutes",
      servings: 8,
    },
  ]);

  const addIngredient = () => {
    let clone = JSON.parse(JSON.stringify(recipe));
    clone.ingredients.push("");
    setRecipe(clone);
  }
  const addStep = () => {
    let clone = JSON.parse(JSON.stringify(recipe));
    clone.steps.push("");
    setRecipe(clone);
  }


  const getRecipe = (recipeId) => {
    return recipes[recipeId - 1];
  };

  const [recipe, setRecipe] = useState(getRecipe(params.recipeId));

  return (
    <div className="px-16 lg:px-32 py-16 mx-auto max-w-screen-sm lg:max-w-screen-2xl">
      {
        editing ? (
          <div className="max-w-xl mt-4">
            <Textfield params={{value: recipe.name, onChange: ()=>{}}} className="text-3xl"></Textfield>
          </div>
        ) : (
          <Header inline>{recipe.name}</Header>
        )
      }
      <span>
        { editing ? (
          <span>
            <label className="">
              <ClockIcon size={16} />
              <select name="time" id="time" className="bg-slate-100 appearance-none inline-block w-40 px-3 py-1.5 border border-solid rounded ml-2">
                <option value="Under 10 Minutes">Under 10 Minutes</option>
                <option value="10 Minutes">10 Minutes</option>
                <option value="15 Minutes">15 Minutes</option>
                <option value="20 Minutes">20 Minutes</option>
                <option value="30 Minutes">30 Minutes</option>
                <option value="45 Minutes">45 Minutes</option>
                <option value="1 hour">1 hour</option>
                <option value="1 hour 15 minutes">1 hour 15 minutes</option>
                <option value="1 hour 30 minutes">1 hour 30 minutes</option>
                <option value="1 hour 45 minutes">1 hour 45 minutes</option>
                <option value="2 hours">2 hours</option>
                <option value="Over 2 hours">Over 2 hours</option>
              </select>
            </label>
            <label className="ml-4">
              <PersonIcon size={16} />

              <select name="serves" id="serves" className="bg-slate-100 appearance-none inline-block w-40 px-3 py-1.5 border border-solid rounded ml-2">
                <option value="1">Serves 1</option>
                <option value="2">Serves 2</option>
                <option value="3">Serves 3</option>
                <option value="4">Serves 4</option>
                <option value="5">Serves 5</option>
                <option value="6">Serves 6</option>
              </select>
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
          <span className="appearance-none inline-block w-96 py-1.5"> {recipe.time} — Serves {recipe.servings}</span>
        )}
      </span>
      <span className="float-right">
        { editing ? (
          <Button primary={false} to={`/recipe/${params.recipeId}/`} className="leading-3 w-24">
            Save
          </Button>
        ) : (
          <Button primary={false} to="edit" className="leading-3 min-w-96">
            Edit
          </Button>
        )}
      </span>
      <span className="block mt-4 lg:mt-0 lg:inline lg:float-right">
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
        )}
      </span>

      <hr className="my-8" />
      <main className="grid grid-cols-1 lg:grid-cols-2">
        <article>
          <section className="mb-12">
            <h3 className="text-xl font-bold mb-4">Ingredients</h3>
            <ul className="list-disc ml-5 leading-relaxed text-xl">
              {editing ? (
                recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="list-item max-w-xl px-5 py-1.5 ">
                    <textarea type="text" value={ingredient} onChange={()=>{}} rows={1} className="align-top w-full max-h-32 min-h-[3rem] bg-slate-100 rounded p-2" />
                  </li>
                ))
              ) : (
                recipe.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))
              )}
            </ul>
            {editing ? (
              <span onClick={addIngredient} className={"block mt-2 py-3 text-lg whitespace-nowrap cursor-pointer select-none font-bold text-gray-700 hover:text-gray-900"}>
                Add Ingredient
              </span>
            ) : null}
          </section>
          <section className="mb-12">
            <h3 className="text-xl font-bold mb-4">Steps</h3>
            <ol className="list-decimal ml-5 leading-relaxed text-xl">
              {editing ? (
                recipe.steps.map((step, i) => (
                  <li key={i} className="list-item max-w-xl px-5 py-1.5 ">
                    <textarea type="text" value={step} onChange={()=>{}} rows={1} className="align-top w-full max-h-32 min-h-[3rem] bg-slate-100 rounded p-2" />
                  </li>
                ))
              ) : (
                recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))
              )}
            </ol>
            {editing ? (
              <span onClick={addStep} className={"block mt-2 py-3 text-lg whitespace-nowrap cursor-pointer select-none font-bold text-gray-700 hover:text-gray-900"}>
                Add Step
              </span>
            ) : null}
          </section>
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
