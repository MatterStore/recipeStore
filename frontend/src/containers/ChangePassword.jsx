import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import validator from 'validator';
import axios from '../api/axios';

import { changePasswordRoute } from '../api/routes';

import SubmitButton from '../components/SubmitButton';
import Header from '../components/Header';
import FormField from '../components/FormField';

export default function Signup() {
  const [, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [newPasswordError, setNewPasswordError] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');

  const [formValid, setFormValid] = useState(false);

  const navigate = useNavigate();

  const handleValidation = (event) => {
    let formIsValid = true;

    if (newPassword !== confirmNewPassword) {
      formIsValid = false;
      setNewPasswordError('Passwords do not match');
    } else if (
      !validator.isStrongPassword(newPassword, {
        minLength: 8,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
    ) {
      formIsValid = false;
      setNewPasswordError('Must contain 8 characters');
    } else {
      setNewPasswordError('');
      formIsValid = true;
    }
    setFormValid(formIsValid);
  };

  const changePasswordSubmit = (e) => {
    e.preventDefault();
    handleValidation();

    if (formValid) {
      axios
        .post(changePasswordRoute, {
          // oldPassword: oldPassword,
          password: newPassword,
          confirmPassword: confirmNewPassword,
        })
        .then(function (response) {
          navigate('/listing');
        })
        .catch(function (error) {
          setChangePasswordError(error.response.data.msg);
        });
    }
  };

  return (
    <div className="flex row min-w-screen justify-center">
      <main className="min-h-screen w-screen flex flex-column items-center container">
        <div className="flex flex-col md:flex-row justify-around flex-grow">
          <div className="p-8 self-center md:mb-32">
            <form
              id="changepasswordform"
              onSubmit={changePasswordSubmit}
              className="change-password-form">
              <Header>Change Password</Header>
              <div className="flex flex-col min-w-full">
                <FormField
                  type="password"
                  placeholder="Enter old password ..."
                  setFunc={setOldPassword}>
                  Old Password
                </FormField>
                <FormField
                  type="password"
                  placeholder="Enter new password ..."
                  setFunc={setNewPassword}>
                  New Password
                </FormField>
                <FormField
                  type="password"
                  placeholder="Re-enter new password ..."
                  setFunc={setConfirmNewPassword}
                  error={newPasswordError || changePasswordError}>
                  Confirm New Password
                </FormField>
                <SubmitButton primary={true} type="submit">
                  Change Password
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
