import Button from "../../components/Button";
import Textfield from "../../components/Textfield";

export default function Login() {
  return (
    <div>
      <h1>Login Page</h1>
      <Textfield></Textfield>
      <Textfield></Textfield>
      <Button to="/listing">Login</Button>
    </div>
  );
};
