import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/AuthContext";
import validator from "validator";
import axios from "../../api/axios";
import { loginRoute } from "../../api/routes";

import SubmitButton from "../../components/SubmitButton";
import Header from "../../components/Header";
import Formfield from "../../components/Formfield";

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [emailError, setemailError] = useState("");
  const [loginError, setloginError] = useState("");
  const [formValid, setFormValid] = useState(false);

  // const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!validator.isEmail(email)) {
      formIsValid = false;
      setemailError("Email Not Valid");
      return false;
    } else {
      setemailError("");
      formIsValid = true;
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      formIsValid = false;
      setpasswordError(
        "Must contain 8 characters, one uppercase letter, one lowercase letter, one number, and one special symbol"
      );
      return false;
    } else {
      setpasswordError("");
      formIsValid = true;
    }
    setFormValid(formIsValid);
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    handleValidation();

    if (formValid) {
      axios
        .post(loginRoute, {
          email: email,
          password: password,
        })
        .then(function (response) {
          // setIsLoggedIn(true);
          // setUser(response.data.user);
          localStorage.setItem("token", response.data.token);
          navigate("/");
        })
        .catch(function (error) {
          setloginError("Invalid Password or Email");
        });
    }
  };

  return (
    <div className="flex row min-w-screen justify-center">
      <main className="min-h-screen w-screen flex flex-column items-center max-w-screen-2xl">
        <div className="flex flex-col md:flex-row justify-around flex-grow">
          <div className="p-8 self-center md:mb-32">
            <form id="loginform" onSubmit={loginSubmit} className="login-form">
              <Header>Login</Header>
              <div className="flex flex-col min-w-full">
                <Formfield
                  type="email"
                  placeholder="Enter Email"
                  setFunc={setEmail}
                />
                <small id="emailHelp" className="text-danger form-text mt-2">
                  {emailError}
                </small>
                <Formfield
                  type="password"
                  placeholder="Enter Password"
                  setFunc={setPassword}
                />
                <small id="passworderror" className="text-danger form-text">
                  {passwordError}
                </small>
                <SubmitButton primary={true} type="submit">
                  Login
                </SubmitButton>
                <small id="loginerror" className="text-danger form-text">
                  {loginError}
                </small>
              </div>
            </form>
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
