const axios = require('axios');
require('dotenv').config();  // To use environment variables
// const yahooFinance = require('yahoo-finance2').default;

// const API_KEY = process.env.FINNHUB_API_KEY; // Add your Finnhub API key in .env file
// const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
// // Function to fetch stock price from Alpha Vantage
// async function fetchStockPrice(symbol) {
//   try {
//     const response = await axios.get('https://www.alphavantage.co/query', {
//       params: {
//         function: 'TIME_SERIES_INTRADAY',
//         symbol: symbol,
//         interval: '1min',
//         apikey: API_KEY,
//       }
      

      
//     });

//     // Log the API response to inspect it
//     console.log('API Response:', response.data);

//     // Ensure response contains the necessary data
//     if (!response.data || !response.data['Time Series (1min)']) {
//       throw new Error('Invalid API response structure');
//     }

    

//     // Extract the latest price from the Alpha Vantage response
//     const timeSeries = response.data['Time Series (1min)'];
//     const latestTimestamp = Object.keys(timeSeries)[0];  // Get the latest time entry
//     const latestData = timeSeries[latestTimestamp];      // Get data for that time

//     // Return the real-time stock price (open price for the latest minute)
//     return latestData['1. open'];
//   } catch (error) {
//     console.error('Error fetching stock price:', error);
//     throw new Error('Error fetching stock price');
//   }
// }

// const fetchStockPrice = async (symbol) => {
//   try {
//     // Fetch the stock price using yahoo-finance2
//     const quote = await yahooFinance.quote(symbol);

//     if (!quote || !quote.regularMarketPrice) {
//       throw new Error('Stock data not found');
//     }

//     const price = quote.regularMarketPrice;  // Get the regular market price
//     return price;
//   } catch (error) {
//     console.error('Error fetching stock price from Yahoo Finance:', error.message || error);
//     throw new Error('Error fetching stock price');
//   }
// };


// to fetch from finnhub
const fetchStockPrice = async (symbol) => {
  const API_KEY = process.env.FINNHUB_API_KEY; // Ensure the API key is set in .env
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

  try {
    console.log(`Fetching stock price for symbol: ${symbol}`); // Debugging log
    const response = await axios.get(url);
    const data = response.data;

    // Debug the full response to ensure data is in expected format
    console.log('API Response:', data);

    // Check if the response contains valid data
    if (!data || !data.c) {  // Assuming 'c' contains the current price in Finnhub response
      console.error('Error: Invalid data structure or symbol not found.');
      return null;  // Return null for invalid or unknown symbols
    }

    console.log(`Fetched price for ${symbol}: ${data.c}`);  // Log the actual price fetched
    return data.c;  // Return the current stock price
  } catch (error) {
    console.error('Error fetching stock price:', error.message || error);
    return null;  // Return null in case of an error
  }
}

module.exports = {
  fetchStockPrice
};