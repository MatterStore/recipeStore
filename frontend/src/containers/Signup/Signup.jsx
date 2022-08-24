import Button from "../../components/Button";
import Header from "../../components/Header";
import Textfield from "../../components/Textfield";

export default function Signup() {
  return (
    <div className="flex row min-w-screen justify-center">
      <main className="min-h-screen w-screen flex flex-column items-center max-w-screen-2xl">
        <div className="flex flex-col md:flex-row justify-around flex-grow">
          <div className="p-8 self-center md:mb-32">
            <Header>Sign Up</Header>
            <div className="flex flex-col min-w-full">
              <Textfield params={{ placeholder: "Email" }}>Email</Textfield>
              <Textfield params={{ placeholder: "Password", type: "password" }}>
                Password
              </Textfield>
              <Button primary={true} to="/listing">
                Sign Up
              </Button>
            </div>
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
