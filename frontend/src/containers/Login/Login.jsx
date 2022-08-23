import Button from "../../components/Button";
import Header from "../../components/Header";
import Textfield from "../../components/Textfield";

export default function Login() {
  return (
    <div>
      <Header>Login Page</Header>
      <Textfield></Textfield>
      <Textfield></Textfield>
      <Button to="/listing">Login</Button>
    </div>
  );
};
