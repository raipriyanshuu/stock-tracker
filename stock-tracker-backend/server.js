const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { sendPriceAlertEmail } = require('./helpers/emailService');
const { fetchStockPrice } = require('./helpers/stockService');

const cors=require('cors');
require('dotenv').config();

const app = require('./app');
const server = http.createServer(app);


// Track active stocks for each client
const activeStocksPerClient = new Map();

// Apply CORS middleware to HTTP routes
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from this origin (your frontend)
  methods: ['GET', 'POST'],
  credentials: true  // Allow credentials such as cookies and authorization headers
}));

// Initialize Socket.io with CORS for WebSocket connections
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',  // Allow WebSocket requests from this origin (your frontend)
    methods: ['GET', 'POST'],
    credentials: true  // Allow credentials like cookies and auth headers
  }
});

// fetchStockPrice('AAPL').then((price) => {
//   console.log('Fetched Price:', price);
// }).catch((error) => {
//   console.error('Error fetching stock price:', error);
// });

//  for alpha vintage....

io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Initialize the list of active stocks for this client
  // activeStocksPerClient.set(socket.id, new Set());

  socket.on('trackStock', async (data) => {
    const { symbol } = data;
    // const clientActiveStocks = activeStocksPerClient.get(socket.id);

    // // Check if the stock is already being tracked
    // if (clientActiveStocks.has(symbol)) {
    //   console.log(`Stock ${symbol} is already being tracked for client ${socket.id}`);
    //   return;  // Skip emitting if stock is already being tracked
    // }

    // // Add the stock to the client's tracked stocks list
    // clientActiveStocks.add(symbol);

    // Fetch stock price and emit priceUpdate
    try {
      const stockPrice = await fetchStockPrice(symbol);
      if (stockPrice) {
        socket.emit('priceUpdate', { symbol, price: stockPrice });

        // Check if the price matches any alerts
        const alerts = await Stock.find({ symbol, alertPrice: { $gte: stockPrice } });
        alerts.forEach(async (alert) => {
          const user = alert.user;  // Assuming alert has a user field
          await sendPriceAlertEmail(user.email, symbol, alert.alertPrice, stockPrice);  // Send email
        });
      }
    } catch (error) {
      console.error('Error fetching stock price or sending email:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    activeStocksPerClient.delete(socket.id);  // Clean up tracked stocks for this client
  });
});





// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//  for yahoo finance2...
// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('trackStock', async (symbol) => {
//     console.log(`Tracking stock: ${symbol}`);

//     try {
//       const stockPrice = await fetchStockPrice(symbol);  // Fetch stock price using Yahoo Finance
//       if (stockPrice) {
//         socket.emit('priceUpdate', { symbol, price: stockPrice });
//       }
//     } catch (error) {
//       console.error('Error tracking stock:', error);
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });
