import { useParams } from "react-router-dom";

export default function Recipe(props) {
  let params = useParams();
  let recipeId = params.recipeId;

  return (
    <div>
      <h1>{props.name}</h1>
      {recipeId}
    </div>
  );
};
