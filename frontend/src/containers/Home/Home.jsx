import Button from "../../components/Button";

export default function Home() {
  return (
    <div>
      <main className="min-h-screen w-screen flex flex-column items-center">
        <div className="flex flex-col md:flex-row justify-around flex-grow">
          <div className="p-8 self-center md:mb-32">
            <h1 className="text-5xl mb-5 mt-8 md:mt-0 subpixel-antialiased">Recipe Store App</h1>
            <nav className="flex justify-center md:justify-left">
              <Button primary={true} to="/signup">Sign Up</Button>
              <Button primary={false} to="/login">Login</Button>
            </nav>
          </div>
          <div className="p-8 self-center">
            <img
              className="rounded-xl self-center"
              src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&w=640&q=80&fm=jpg&crop=entropy&cs=tinysrgb"
              alt="Food on bench"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
