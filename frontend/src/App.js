import { Routes, Route } from "react-router-dom";
import "./App.css";
import Recipe from "./components/Recipe";
import Home from "./containers/Home/Home";
import Listing from "./containers/Listing/Listing";
import Login from "./containers/Login/Login";
import Register from "./containers/Register/Register";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/recipe/:recipeId" element={<Recipe />} />
      </Routes>
    </div>
  );
}

export default App;
