import { Link } from "react-router-dom";
import Recipe from "../../components/Recipe";

export default function Listing() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <main>
        <h1>Recipes</h1>
        <div>
          <Recipe id="1" title="Gnocchi" />
        </div>
      </main>
    </div>
  );
}
