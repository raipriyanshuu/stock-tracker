const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true },           // Stock symbol (e.g., AAPL for Apple)
  alertPrice: { type: Number, required: true },       // Price at which user wants to get an alert
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user who set the alert
  alertTriggered: { type: Boolean, default: false }   // Flag to check if alert has already been triggered
});

const Stock = mongoose.model('Stock', StockSchema);
module.exports = Stock;

