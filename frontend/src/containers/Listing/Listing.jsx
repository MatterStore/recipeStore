import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Recipe from "../../components/Recipe";
import Subheader from "../../components/Subheader";

export default function Listing() {
  const collections = {
    "Your Recipe Collection": [
      {
        id: "1",
        name: "Gnocchi"
      },
      {
        id: "2",
        name: "Ratatouille"
      }
    ],
    "Easy Dinners": [
      {
        id: "1",
        name: "Gnocchi"
      }
    ]
  }
  return (
    <div>
      <main className="p-16">
        <Header>Recipes</Header>
        {
          Object.entries(collections).map(([collectionName, recipes], i) => { return ( 
            <div className="mt-12 mb-16" key={i}>
              <Subheader>
                {collectionName}
                <Link
                  to={`/collection/${collectionName}`}
                  className={`ml-8 text-lg underline subpixel-antialiased text-purple-600`}
                >
                  View All
                </Link>
              </Subheader>
              <div>
                {
                  recipes.map((recipe, j) => { return (
                    <Recipe {...recipe} key={j} />
                  )})
                }
              </div>
            </div>
          )})
        }
        
      </main>
    </div>
  );
}
