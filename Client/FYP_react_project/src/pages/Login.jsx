import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import '../CSS/login.css';

export default function Login({ setIsAuthenticated }) {
  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

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

        //Set authenticated state and navigate
        setIsAuthenticated(true);
        console.log("Navigating to dashboard...");
        navigate('/system/dashboard');
      }
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      alert("Login failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div className="login-box">
          <div className="login-header">
            <header className='login-logo'><img src="school_logo.jpg" alt="School Logo" /></header>
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

//required if Login expects the prop
Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired
};
