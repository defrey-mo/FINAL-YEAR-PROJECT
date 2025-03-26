/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import '../CSS/login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value }); 
  };

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8084/login', 
        values, 
        {
          headers: { "Content-Type": "application/json" } 
        }
      );

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token); 
        console.log("Login successful:", response.data);
        navigate('/system/dashboard');
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div className="login-box">
          <div className="login-header">
            <header>Login</header>
          </div>
          <div className="input-box">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Username" 
              autoComplete="off" 
              required 
              name="username" 
              value={values.username} 
              onChange={handleChanges} 
            />
          </div>
          <div className="input-box">
            <input 
              type="password" 
              className="input-field" 
              placeholder="Password" 
              autoComplete="off" 
              required 
              name="password" 
              value={values.password}
              onChange={handleChanges} 
            />
          </div>
          <div className="input-submit">
            <button className="submit-btn" id="submit">Login</button>
          </div>
        </div>
      </form>
    </div>
  );
}
