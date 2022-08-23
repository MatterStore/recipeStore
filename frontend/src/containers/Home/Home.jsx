import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <main>
        <h1>Recipe Store App</h1>
      </main>
      <nav>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
    </div>
  );
}
