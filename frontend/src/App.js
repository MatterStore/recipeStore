import { Routes, Route } from "react-router-dom";
import Recipe from "./containers/Recipe/Recipe";
import Home from "./containers/Home/Home";
import Listing from "./containers/Listing/Listing";
import Login from "./containers/Login/Login";
import Signup from "./containers/Signup/Signup";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/recipe/:recipeId" element={<Recipe />} />
      </Routes>
    </div>
  );
}

export default App;
