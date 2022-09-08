import { useState } from "react";
import { useNavigate } from "react-router-dom";

import validator from "validator";
import axios from "../../api/axios";

import { signupRoute } from "../../api/routes";

import SubmitButton from "../../components/SubmitButton";
import Header from "../../components/Header";
import Formfield from "../../components/Formfield";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setemailError] = useState("");
  const [passwordError, setpasswordError] = useState("");
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
      setemailError("Email is Not Valid");
      return false;
    } else {
      setemailError("");
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
      setpasswordError("Must contain 8 characters");
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
                />
                <small id="nameHelp" className="text-danger form-text mt-2">
                  {nameError}
                </small>
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
                <small id="passwordError" className="text-danger form-text">
                  {passwordError}
                </small>
                <SubmitButton primary={true} type="submit">
                  Sign Up
                </SubmitButton>
                <small id="signupError" className="text-danger form-text">
                  {signupError}
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
