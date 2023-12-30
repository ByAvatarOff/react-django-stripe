import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonContext } from "./LoginContext";
import './LoginComponent.css'

import { request } from '../../requests/axiosRequest';


const LoginComponent = () => {
  const { buttonState, setButtonState } = useContext(ButtonContext);

  let navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',

  });
  const handleEmailChange = (e) => {
    setFormData({ ...formData, 'username': e.target.value });
  };
  const handlePasswordChange = (e) => {
    setFormData({ ...formData, 'password': e.target.value });
  };


  const submitHandler = (e) => {
    e.preventDefault();
    request.post('api/token/', new URLSearchParams(formData))
      .then(response => {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        setButtonState(true);
        navigate('/')

      })
      .catch(error => {
        alert('Wrong username or password');
      });
  };

  return (   
    <div className="login-dark" style={{ height: "695px" }}>
      <form onSubmit={submitHandler}>
        <h2 className="sr-only">Login Form</h2>
        <div className="form-group"><input className="form-control" type="text" name="username" placeholder="username" onChange={handleEmailChange} /></div>
        <div className="form-group"><input className="form-control" type="password" name="password"
          placeholder="Password" onChange={handlePasswordChange} />
        </div>
        <div className="form-group"><button className="btn btn-primary btn-block" onClick={submitHandler}>Log In</button></div>
      </form>
    </div>

  )
}

export default LoginComponent;