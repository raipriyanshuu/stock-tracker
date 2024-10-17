const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// JWT secret from environment
const JWT_SECRET = process.env.JWT_SECRET;

// Signup route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = new User({ username, email, password });
      await user.save()
      .then(() => console.log('User saved successfully'))
      .catch(err => console.error('Error saving user:', err));
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token });
    } catch (err) {
      console.error('Error during signup:', err); // Log the detailed error to the terminal
      res.status(500).json({ message: 'Server error', error: err.message }); // Send error details in the response for debugging
    }
  });
  
  // Login route
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (err) {
      console.error('Error during login:', err); // Log the detailed error to the terminal
      res.status(500).json({ message: 'Server error', error: err.message }); // Send error details in the response for debugging
    }
  });
  

module.exports = router;
