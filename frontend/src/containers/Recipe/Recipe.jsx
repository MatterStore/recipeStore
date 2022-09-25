import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Subheader from '../../components/Subheader';
import Button from '../../components/Button';
import Tag from '../../components/Tag';

export default function Recipe(props) {
  let params = useParams();

  const recipes = [
    {
      id: '1',
      name: 'Gnocchi',
      primaryImage:
        'https://unsplash.com/photos/Zmhi-OMDVbw/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8MXx8Z25vY2NoaXxlbnwwfHx8fDE2NjE2NzU5NjQ&w=600',
      ingredients: ['100g Flour', '1tspn Sugar'],
      steps: ['Mix the flour with the sugar', 'Serve and enjoy!'],
      tags: ['Vegetarian'],
      time: '3 hours',
      servings: 4
    },
    {
      id: '2',
      name: 'Ratatouille',
      primaryImage:
        'https://unsplash.com/photos/3vDJ--i7w88/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8M3x8cmF0YXRvdWlsbGV8ZW58MHx8fHwxNjYxNjc2MDY0&w=600',
      ingredients: ['250g Pumpkin', '500mL Water'],
      steps: ['Pour the water onto the pumpkin', 'Serve and enjoy!'],
      tags: ['Anton Ego Approved', 'Gluten Free'],
      time: '15 minutes',
      servings: 8
    }
  ];

  const getRecipe = (recipeId) => {
    return recipes[recipeId - 1];
  };

  const recipe = getRecipe(params.recipeId);

  return (
    <div className="px-16 lg:px-32 py-16 mx-auto container">
      <Header inline>{recipe.name}</Header>
      <span>
        {recipe.time} — Serves {recipe.servings}
      </span>
      <span className="float-right">
        <Button primary={false} to="edit" className="leading-3">
          Edit
        </Button>
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
