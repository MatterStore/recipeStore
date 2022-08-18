import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import Home from "./containers/Home/Home";
import About from "./containers/About/About";

function App() {
  return (
    <div>
      <div>
        <NavLink exact activeClassName="active" to="/about">
          About
        </NavLink>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
