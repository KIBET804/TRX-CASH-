// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !confirm) {
      alert('Please fill all fields');
      return;
    }

    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      let message = 'Registration failed.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'That email is already registered.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password must be at least 6 characters.';
      } else {
        message = error.message;
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-box">
        <h2>{isRegistering ? 'Create TRX Account' : 'Login to TRX'}</h2>

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

        {isRegistering && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        )}

        <button
          onClick={isRegistering ? handleRegister : handleLogin}
          disabled={loading}
        >
          {loading
            ? isRegistering
              ? 'Registering...'
              : 'Logging in...'
            : isRegistering
            ? 'Register'
            : 'Login'}
        </button>

        <p style={{ marginTop: '15px' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ color: '#ffa500', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isRegistering ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;