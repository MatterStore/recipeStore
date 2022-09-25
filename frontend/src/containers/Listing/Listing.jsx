import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Button from '../../components/Button';
import Recipe from '../../components/Recipe';
import Subheader from '../../components/Subheader';

export default function Listing() {
  const recipes = [
    {
      id: '1',
      name: 'Gnocchi',
      primaryImage:
        'https://unsplash.com/photos/Zmhi-OMDVbw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MXx8Z25vY2NoaXxlbnwwfHx8fDE2NjE2NzU5NjQ&w=400'
    },
    {
      id: '2',
      name: 'Ratatouille',
      primaryImage:
        'https://unsplash.com/photos/3vDJ--i7w88/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8M3x8cmF0YXRvdWlsbGV8ZW58MHx8fHwxNjYxNjc2MDY0&w=400'
    }
  ];
  const collections = {
    'Your Recipe Collection': [1, 2],
    'Easy Dinners': [1]
  };

  return (
    <div>
      <main className="p-16 mx-auto container flex flex-col">
        <Header>
          Recipes
          <span className="block mt-8 lg:mt-0 lg:inline-block lg:float-right">
            <Button to="/recipe/new" primary={true} className="mr-0">
              New Recipe
            </Button>
          </span>
        </Header>
        {Object.entries(collections).map(([collectionName, collectionRecipes], i) => {
          return (
            <div className="mt-4 mb-12 self-center lg:self-start w-full" key={i}>
              <Subheader key={i}>
                {collectionName}
                <Link
                  to={`/collection/${collectionName}`}
                  className={`ml-8 text-lg underline subpixel-antialiased text-purple-600 whitespace-pre-wrap`}
                >
                  View All
                </Link>
              </Subheader>
              <div className="self-center lg:self-start">
                {collectionRecipes
                  .map((index) => recipes[index - 1])
                  .map((recipe, j) => {
                    return (
                      <div className="mx-auto inline-block" key={recipe.name + ` ${i} ${j}`}>
                        <Recipe {...recipe} />
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
