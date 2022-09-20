import { useState } from "react";
import { useParams } from "react-router-dom";

import axios from "../../api/axios";

import Header from "../../components/Header";
import Subheader from "../../components/Subheader";
import Button from "../../components/Button";
import Tag from "../../components/Tag";
import { recipeRoute } from "../../api/routes";

export default function Recipe(props) {
  const [recipeData, setRecipeData] = useState(null); 
  const [recipeLoading, setRecipeLoading] = useState(true); 
  const [recipeError, setRecipeError] = useState(null); 

  let params = useParams();

  useEffect(() => {
    async function fetchRecipe() {
      axios
        .get(recipeRoute(params.recipeId))
        .then((response) => {
          setRecipeData(response.data);
          setRecipeLoading(false);
        })
        .catch((error) => setRecipeError(error));
    }
    fetchRecipe();
  }, []);

  return (
    (!recipeLoading && !recipeError && (
    
    <div className="px-16 lg:px-32 py-16 mx-auto container">
      <Header inline>{recipeData.title}</Header>
      <span>
        {recipeData.time} — Serves {recipeData.servings}
      </span>
      <span className="float-right">
        <Button primary={false} to="edit" className="leading-3">
          Edit
        </Button>
      </span>
      <span className="block mt-4 lg:mt-0 lg:inline lg:float-right">
        {recipeData.tags.map((tag, i) => (
          <Tag key={i}>{tag}</Tag>
        ))}
      </span>

      <hr className="my-8" />
      <main className="grid grid-cols-1 lg:grid-cols-2">
        <article>
          <section className="mb-12">
            <h3 className="text-xl font-bold mb-4">Ingredients</h3>
            <ul className="list-disc ml-5 leading-relaxed text-xl">
              {recipeData.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
          </section>
          <section className="mb-12">
            <h3 className="text-xl font-bold mb-4">Steps</h3>
            <ol className="list-decimal ml-5 leading-relaxed text-xl">
              {recipeData.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>
        </article>
        <div>
          <img
            src={recipeData.primaryImage}
            alt=""
            className="object-cover w-full max-h-96 pb-12 mt-4 rounded"
          />
        </div>
      </main>
    </div>
    ))
  );
}
