import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLogin, toggleSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Attempting to log in with email:', email);

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password,
      });
      console.log('Login response:', response.data);

      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token); // Store the JWT token in local storage
        onLogin(token); // Pass token to parent component
      } else {
        console.error('No token returned from login');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <div className="signup-option">
        <p>Don't have an account? <button onClick={toggleSignup}>Sign Up</button></p>
      </div>
    </div>
  );
};

export default LoginForm;
