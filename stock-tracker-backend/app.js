// app.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');  // Import cors
const app = express();

// Load environment variables
require('dotenv').config();

// Enable CORS to allow requests from frontend (port 3000)
app.use(cors());

const authRoutes = require('./routes/auth');
const stockRoutes = require('./routes/stock');


// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Use the auth routes
app.use('/api/auth', authRoutes);
// Use the stock routes
app.use('/api/stocks', stockRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Stock Tracker API is running');
});

module.exports = app;
