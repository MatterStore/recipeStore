import Header from "../../components/Header";
import Recipe from "../../components/Recipe";

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
            <div className="" key={i}>
              <Header>{collectionName}</Header>
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
