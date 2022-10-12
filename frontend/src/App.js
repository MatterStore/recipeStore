import { Routes, Route } from 'react-router-dom';
import Recipe from './containers/Recipe/Recipe';
import Home from './containers/Home/Home';
import Listing from './containers/Listing/Listing';
import Login from './containers/Login/Login';
import Signup from './containers/Signup/Signup';
import { useEffect } from 'react';
import Nav from './components/Nav';

function App() {
  useEffect(() => {
    document.title = 'Recipe Store';
  });

  return (
    <div>
      <Nav></Nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/recipe/:recipeId" element={<Recipe edit={false} />} />
        <Route path="/recipe/:recipeId/edit" element={<Recipe edit={true} />} />
        <Route
          path="/recipe/new"
          element={<Recipe new="true" edit={false} />}
        />
      </Routes>
    </div>
  );
}

export default App;
