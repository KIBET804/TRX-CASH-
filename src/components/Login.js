// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Import this
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // 👈 Initialize it

  const handleLogin = () => {
    if (email && password) {
      // You can later add authentication here
      navigate('/dashboard'); // 👈 Navigate to dashboard
    } else {
      alert('Please enter email and password');
    }
  };

  const handleRegister = () => {
    alert(`Registering with ${email}`);
  };

  return (
    <div className="login-background">
      <div className="login-box">
        <h2>Register to TRX</h2>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister} className="register-button">
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;