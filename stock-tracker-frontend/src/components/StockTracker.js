import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const StockTracker = () => {
  const [symbol, setSymbol] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [realTimePrice, setRealTimePrice] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');  // State to store error message
  const [trackingSymbols, setTrackingSymbols] = useState(new Set());  // Set to track symbols already requested

  const token = localStorage.getItem('token');  // Get JWT token from localStorage
  const socket = useRef(null);  // Persistent socket connection

  // Initialize socket connection on component mount
  useEffect(() => {
    socket.current = io('http://localhost:5001');  // Connect to socket.io server

    // Handle real-time price updates from the server
    socket.current.on('priceUpdate', (data) => {
      if (data.price) {
        setRealTimePrice(data.price);  // Set the real-time price for the searched stock
        setError('');  // Clear any previous error
      } else {
        alert('Invalid stock symbol. Please enter a valid stock symbol.');
        setRealTimePrice(null);  // Reset the price to null
      }
    });

    // Clean up socket connection on component unmount
    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Fetch saved alerts when the component mounts
  useEffect(() => {
    const fetchSavedAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/stocks/my-alerts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAlerts(response.data);  // Set the fetched alerts into the state
      } catch (error) {
        console.error('Error fetching saved alerts:', error);
      }
    };

    if (token) {
      fetchSavedAlerts();  // Fetch alerts only if the user is authenticated
    }
  }, [token]);

  // Search for real-time stock price
  const handleSearchStock = () => {
    if (symbol) {
      setError('');
      setRealTimePrice(null);  // Clear the previous real-time price
    // Request real-time price update from the server

    setTrackingSymbols(new Set()); // Clear previously tracked symbols
      // Request real-time price update from the server
      socket.current.emit('trackStock', { symbol });

      // Emit the socket event to fetch the real-time stock price
    socket.current.emit('trackStock', { symbol });

    // Listen for the price update or an error response from the server
    // socket.current.on('priceUpdate', (data) => {
    //   if (data.price !== undefined && data.price !== null) {
    //     setRealTimePrice(data.price);
    //   } else {
    //     // If price is undefined or null, show an alert
    //     alert('Invalid stock symbol. Please enter a valid stock symbol.');
    //   }
    // });
    } else {
      alert('Please enter a valid stock symbol');
      setRealTimePrice(null);  // Clear the real-time price if no symbol is entered
    }
  };

  // Add multiple alerts for the same stock
  const handleAddAlert = async () => {
    if (!alertPrice || !realTimePrice) {
      alert('Please search for a stock and enter an alert price first.');
      return;
    }

    const newAlert = { symbol, alertPrice };

    try {
      const response = await axios.post(
        'http://localhost:5001/api/stocks/set-alert',
        newAlert,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new alert to the frontend state after it has been saved to the backend
      setAlerts((prevAlerts) => [...prevAlerts, response.data]);

      // Clear alert price field after adding the alert
      setAlertPrice('');
    } catch (error) {
      console.error('Error adding alert:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');  // Clear token from localStorage
    window.location.href = '/login';  // Redirect to login page
  };

  // Remove an alert from the backend and frontend
  const handleDeleteAlert = async (alertId) => {
    try {
      await axios.delete(`http://localhost:5001/api/stocks/delete-alert/${alertId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the alert from the frontend state after successful deletion
      setAlerts(alerts.filter((alert) => alert._id !== alertId));
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  return (
    <div className="container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <h2>Search Stock</h2>
      <input
        type="text"
        placeholder="Stock Symbol (e.g., AAPL)"
        value={symbol}
        onChange={(e) => {
          setSymbol(e.target.value)
          setRealTimePrice(null);  // Clear the real-time price when typing
        }}
        
      />
      <button onClick={handleSearchStock}>Search Stock</button>
      {/* Show error alert if there's any error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {realTimePrice!==null && (
        <div>
          <h3>Real-Time Price for {symbol}: ${realTimePrice}</h3>
        </div>
      )}

      <h2>Set Alerts for {symbol}</h2>
      <input
        type="number"
        placeholder="Alert Price"
        value={alertPrice}
        onChange={(e) => setAlertPrice(e.target.value)}
      />
      <button onClick={handleAddAlert}>Set Alert</button>

      <h2>Alerts for {symbol}</h2>
      <ul>
        {alerts
          .filter((alert) => alert.symbol === symbol)
          .map((alert) => (
            <React.Fragment key={alert._id}>
              <li>
                Alert Price: {alert.alertPrice} for {alert.symbol}
                <button onClick={() => handleDeleteAlert(alert._id)}>Delete Alert</button>
              </li>

              {/* Add horizontal line after each alert item */}
              <hr style={{ border: '2px solid grey' }} />
            </React.Fragment>
          ))}
      </ul>
    </div>
  );
};

export default StockTracker;
