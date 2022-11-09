import { Routes, Route } from 'react-router-dom';
import Recipe from './containers/Recipe';
import Home from './containers/Home';
import Listing from './containers/Listing';
import Login from './containers/Login';
import Signup from './containers/Signup';
import ChangePassword from './containers/ChangePassword';
import { useEffect } from 'react';
import Nav from './components/Nav';

function App() {
  useEffect(() => {
    document.title = 'FOODIFY';
  });

  return (
    <div>
      <Nav></Nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile/change-password" element={<ChangePassword />} />
        <Route path="/listing/public" element={<Listing public={true} />} />
        <Route path="/listing/user" element={<Listing public={false} />} />
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
