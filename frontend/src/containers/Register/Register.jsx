import Button from "../../components/Button";
import Textfield from "../../components/Textfield";

export default function Register() {
  return (
    <div>
      <h1>Register Page</h1>
      <Textfield></Textfield>
      <Textfield></Textfield>
      <Button to="/listing">Register</Button>
    </div>
  );
};
