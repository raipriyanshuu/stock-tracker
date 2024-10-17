const express = require('express');
const Stock = require('../models/Stock');
const protect = require('../middlewares/auth');  // Ensure the user is authenticated
const { sendPriceAlertEmail } = require('../helpers/emailService');

const router = express.Router();

// Route to track a stock and set an alert for the authenticated user
router.post('/track', protect, async (req, res) => {
  const { symbol, alertPrice } = req.body;

  try {
    const stock = new Stock({
      symbol,
      alertPrice,
      user: req.user._id,  // Associate the stock tracking with the authenticated user
    });
    await stock.save();
    res.status(201).json(stock);
  } catch (err) {
    console.error('Error tracking stock:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to add stock data with alertPrice
router.post('/add-stock', protect, async (req, res) => {
  const { symbol, name, price, alertPrice } = req.body;

  if (!symbol || !name || !price || !alertPrice) {
    return res.status(400).json({ message: 'All fields are required, including alertPrice' });
  }

  try {
    const stock = new Stock({ symbol, name, price, alertPrice, user: req.user._id });
    await stock.save();  // Save the stock to MongoDB
    res.status(201).json({ message: 'Stock added successfully', stock });
  } catch (err) {
    console.error('Error saving stock:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get all tracked stocks for the authenticated user
router.get('/my-stocks', protect, async (req, res) => {
  try {
    const stocks = await Stock.find({ user: req.user._id });  // Find all stocks tracked by the logged-in user
    res.status(200).json(stocks);
  } catch (err) {
    console.error('Error fetching stocks:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a tracked stock by ID for the authenticated user
router.delete('/delete/:id', protect, async (req, res) => {
  try {
    const stockId = req.params.id;

    // Find and delete the stock by ID and user
    const deletedStock = await Stock.findOneAndDelete({ _id: stockId, user: req.user._id });
    
    if (!deletedStock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.status(200).json({ message: 'Stock deleted successfully', stock: deletedStock });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to set multiple alerts for the same stock
router.post('/set-alert', protect, async (req, res) => {
  const { symbol, alertPrice } = req.body;

  try {
    const stock = new Stock({
      symbol,
      alertPrice,
      user: req.user._id,
    });
    await stock.save();
    res.status(201).json(stock);
  } catch (err) {
    console.error('Error setting alert:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-alerts', protect, async (req, res) => {
  try {
    const alerts = await Stock.find({ user: req.user._id });  // Find all alerts set by the user
    res.status(200).json(alerts);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


//  delete a particular alert saved by user....
router.delete('/delete-alert/:id', protect, async (req, res) => {
  try {
    const alertId = req.params.id;
    const deletedAlert = await Stock.findByIdAndDelete({ _id: alertId, user: req.user._id });
    
    if (!deletedAlert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route to trigger email
router.get('/test-email', async (req, res) => {
  try {
    const email = 'priyanshurai0817@gmail.com';  // Use your email for testing
    const symbol = 'AAPL';
    const alertPrice = 150;
    const currentPrice = 155;

    // Trigger the email sending function
    await sendPriceAlertEmail(email, symbol, alertPrice, currentPrice);

    res.status(200).json({ message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ message: 'Error sending test email' });
  }
});



module.exports = router;
