import Button from "../../components/Button";
import Header from "../../components/Header";
import Textfield from "../../components/Textfield";

export default function Signup() {
  return (
    <div>
      <Header>Signup Page</Header>
      <Textfield></Textfield>
      <Textfield></Textfield>
      <Button to="/listing">Signup</Button>
    </div>
  );
};
