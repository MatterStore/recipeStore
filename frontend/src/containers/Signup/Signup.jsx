import { useState } from "react";
import { useNavigate } from "react-router-dom";

import validator from "validator";
import axios from "../../api/axios";

import { signupRoute } from "../../api/routes";

import SubmitButton from "../../components/SubmitButton";
import Header from "../../components/Header";
import Formfield from "../../components/FormField";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");

  const [formValid, setFormValid] = useState(false);

  const navigate = useNavigate();

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!validator.isAlpha(name)) {
      formIsValid = false;
      setNameError("Name is Not Valid");
      return false;
    } else {
      setNameError("");
      formIsValid = true;
    }

    if (!validator.isEmail(email)) {
      formIsValid = false;
      setEmailError("Email is Not Valid");
      return false;
    } else {
      setEmailError("");
      formIsValid = true;
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
    ) {
      formIsValid = false;
      setPasswordError("Must contain 8 characters");
      return false;
    } else {
      setPasswordError("");
      formIsValid = true;
    }
    setFormValid(formIsValid);
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    handleValidation();

    if (formValid) {
      axios
        .post(signupRoute, {
          name: name,
          email: email,
          password: password,
        })
        .then(function (response) {
          navigate("/login");
        })
        .catch(function (error) {
          setSignupError(error.response.data.message);
        });
    }
  };

  return (
    <div className="flex row min-w-screen justify-center">
      <main className="min-h-screen w-screen flex flex-column items-center max-w-screen-2xl">
        <div className="flex flex-col md:flex-row justify-around flex-grow">
          <div className="p-8 self-center md:mb-32">
            <form id="loginform" onSubmit={loginSubmit} className="login-form">
              <Header>Sign Up</Header>
              <div className="flex flex-col min-w-full">
                <Formfield
                  type="name"
                  placeholder="Enter Name"
                  setFunc={setName}
                  error={nameError}
                />
                <Formfield
                  type="email"
                  placeholder="Enter Email"
                  setFunc={setEmail}
                  error={emailError}
                />
                <Formfield
                  type="password"
                  placeholder="Enter Password"
                  setFunc={setPassword}
                  error={signupError || passwordError}
                />
                <SubmitButton primary={true} type="submit">
                  Sign Up
                </SubmitButton>
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
