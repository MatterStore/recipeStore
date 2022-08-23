import { useParams } from "react-router-dom";
import Header from "../../components/Header";

export default function Recipe(props) {
  let params = useParams();
  let recipeId = params.recipeId;

  const getRecipe = (recipeId) => {
    return ["Gnocchi", "Ratatouille"][recipeId-1]
  }

  const recipe = getRecipe(params.recipeId);

  return (
    <div className="p-16">
      <Header>{recipe}</Header>
    </div>
  );
};
