import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUp';
import StockTracker from './components/StockTracker';
import './style.css';  // Import the CSS file for styling

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [showSignup, setShowSignup] = useState(false);

  // Handle login and store the token
  const handleLogin = (token) => {
    setToken(token);
    localStorage.setItem('token', token); // Save token in localStorage
  };

  // Handle logout: remove token and redirect to login page
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  // Toggle between sign-up and login
  const toggleSignup = () => {
    setShowSignup(!showSignup);
  };

  return (
    <div>
      {!token ? (
        showSignup ? (
          <SignUpForm onSignup={toggleSignup} />
        ) : (
          <LoginForm onLogin={handleLogin} toggleSignup={toggleSignup} />
        )
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>  {/* Add logout button */}
          <StockTracker />
        </div>
      )}
    </div>
  );
};

export default App;
