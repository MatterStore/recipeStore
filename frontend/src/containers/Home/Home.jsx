import Button from "../../components/Button";
import Header from "../../components/Header";

export default function Home() {
  return (
    <div className="flex row min-w-screen justify-center">
      <main className="min-h-screen w-screen flex flex-column items-center max-w-screen-2xl">
        <div className="flex flex-col md:flex-row justify-around flex-grow">
          <div className="p-8 self-center md:mb-32">
            <Header>Recipe Store App</Header>
            <nav className="flex justify-center md:justify-start">
              <Button primary={true} to="/signup">
                Sign Up
              </Button>
              <Button primary={false} to="/login">
                Login
              </Button>
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
