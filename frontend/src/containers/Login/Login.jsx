import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../contexts/AuthContext';
import validator from 'validator';
import axios from '../../api/axios';
import { loginRoute } from '../../api/routes';

import SubmitButton from '../../components/SubmitButton';
import Header from '../../components/Header';
import FormField from '../../components/FormField';

export default function Login() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [formValid, setFormValid] = useState(false);

  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleValidation = (event) => {
    let formIsValid = true;

    if (!validator.isEmail(email)) {
      formIsValid = false;
      setEmailError('Email Not Valid');
      return false;
    } else {
      setEmailError('');
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
      setPasswordError('Must contain 8 characters');
      return false;
    } else {
      setPasswordError('');
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
          setIsLoggedIn(true);
          setUser(response.data.user);
          localStorage.setItem('token', response.data.token);
          navigate('/listing/');
        })
        .catch(function (error) {
          setLoginError('Invalid Password or Email');
        });
    }
  };

  return (
    <div className="flex row min-w-screen justify-center">
      <main className="min-h-screen w-screen flex flex-column items-center container">
        <div className="flex flex-col md:flex-row justify-around flex-grow">
          <div className="p-8 self-center md:mb-32">
            <form id="loginform" onSubmit={loginSubmit} className="login-form">
              <Header>Login</Header>
              <div className="flex flex-col min-w-full">
                <FormField
                  type="email"
                  placeholder="Enter Email"
                  setFunc={setEmail}
                  error={emailError}
                />
                <FormField
                  type="password"
                  placeholder="Enter Password"
                  setFunc={setPassword}
                  error={loginError || passwordError}
                />
                <SubmitButton primary={true} type="submit">
                  Login
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
