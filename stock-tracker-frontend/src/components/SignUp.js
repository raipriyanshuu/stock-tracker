import React, { useState } from 'react';
import axios from 'axios';

const SignUpForm = ({ onSignup }) => {
  // State variables for user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form behavior (page reload)
    console.log('Form submitted. Name:', username, 'Email:', email, 'Password:', password);

    try {
      // Send POST request to the backend
      const response = await axios.post('http://localhost:5001/api/auth/signup', {
        username,
        email,
        password,
      });
      console.log('Signup response:', response.data);  // Log the backend response

      // Trigger callback after successful signup
      onSignup();
    } catch (err) {
      console.error('Signup failed:', err);  // Log any errors
    }
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      {/* Attach the handleSubmit function to the form */}
      <form onSubmit={handleSubmit}>  
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
