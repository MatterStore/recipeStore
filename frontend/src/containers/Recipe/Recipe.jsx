import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Button from "../../components/Button";
import Tag from "../../components/Tag";
import Textfield from "../../components/Textfield";
import {ClockIcon, PersonIcon, LockIcon, GlobeIcon} from '@primer/octicons-react'

export default function Recipe(props) {
  let params = useParams();

  const editing = props.edit;

  const recipes = [
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
  ];

  const getRecipe = (recipeId) => {
    return recipes[recipeId - 1];
  };

  const recipe = getRecipe(params.recipeId);

  return (
    <div className="px-16 lg:px-32 py-16 mx-auto max-w-screen-sm lg:max-w-screen-2xl">
      {
        editing ? (
          <div className="max-w-xl">
            <Textfield value={recipe.name} className="text-3xl"></Textfield>
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
          <span className="appearance-none inline-block w-96 px-5 py-1.5"> {recipe.time} — Serves {recipe.servings}</span>
        )}
      </span>
      <span className="float-right">
        { editing ? (
          <Button primary={false} to={`/recipe/${params.recipeId}/`} className="leading-3">
            Save
          </Button>
        ) : (
          <Button primary={false} to="edit" className="leading-3">
            Edit
          </Button>
        )}
      </span>
      <span className="block mt-4 lg:mt-0 lg:inline lg:float-right">
        {recipe.tags.map((tag, i) => (
          <Tag key={i}>{tag}</Tag>
        ))}
      </span>

      <hr className="my-8" />
      <main className="grid grid-cols-1 lg:grid-cols-2">
        <article>
          <section className="mb-12">
            <h3 className="text-xl font-bold mb-4">Ingredients</h3>
            <ul className="list-disc ml-5 leading-relaxed text-xl">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
          </section>
          <section className="mb-12">
            <h3 className="text-xl font-bold mb-4">Steps</h3>
            <ol className="list-decimal ml-5 leading-relaxed text-xl">
              {recipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>
        </article>
        <div>
          <img
            src={recipe.primaryImage}
            alt=""
            className="object-cover w-full max-h-96 pb-12 mt-4 rounded"
          />
        </div>
      </main>
    </div>
  );
}
