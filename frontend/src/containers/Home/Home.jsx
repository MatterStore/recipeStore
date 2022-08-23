import Button from "../../components/Button";

export default function Home() {
  return (
    <div>
      <main>
        <h1 className="text-5xl mb-10 subpixel-antialiased">Recipe Store App</h1>
      </main>
      <nav>
        <Button primary={true} to="/signup">Sign Up</Button>
        <Button primary={false} to="/login">Login</Button>
      </nav>
    </div>
  );
}
