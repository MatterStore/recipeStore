import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Subheader from "../../components/Subheader";

export default function Recipe(props) {
  let params = useParams();

  const recipes = [
    {
      id: "1",
      name: "Gnocchi",
      primaryImage: "https://unsplash.com/photos/Zmhi-OMDVbw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MXx8Z25vY2NoaXxlbnwwfHx8fDE2NjE2NzU5NjQ&w=400",
      ingredients: [
        "100g Flour",
        "1tspn Sugar"
      ],
      steps: [
        "Mix the flour with the sugar",
        "Serve and enjoy!"
      ],
      tags: [
        "Vegetarian"
      ]
    },{
      id: "2",
      name: "Ratatouille",
      primaryImage: "https://unsplash.com/photos/3vDJ--i7w88/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8M3x8cmF0YXRvdWlsbGV8ZW58MHx8fHwxNjYxNjc2MDY0&w=400",
      ingredients: [
        "250g Pumpkin",
        "500mL Water"
      ],
      steps: [
        "Pour the water onto the pumpkin",
        "Serve and enjoy!"
      ],
      tags: [
        "Gluten Free"
      ]
    }
  ];

  const getRecipe = (recipeId) => {
    return recipes[recipeId-1]
  }

  const recipe = getRecipe(params.recipeId);

  return (
    <div className="p-16">
      <Header>{recipe.name}</Header>
      <div>
        <ul>
          {
            recipe.tags.map((tag, i) => (
              <span key={i}>{tag}</span>
            ))
          }
        </ul>
      </div>
      <div>
        <Subheader>Ingredients</Subheader>
        <ul>
          {
            recipe.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))
          }
        </ul>
      </div>
      <div>
        <Subheader>Steps</Subheader>
        <ol>
          {
            recipe.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))
          }
        </ol>
      </div>
      <div>
        <img
          src={recipe.primaryImage}
          alt=""
          className="object-cover w-96 pb-12 mt-4 rounded"
        />
      </div>
    </div>
  );
};
