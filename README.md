# **Real-Time Stock Tracker**

Overview
The Real-Time Stock Tracker is a web application that allows users to track real-time stock prices. Users can search for specific stocks, set price alerts, and get notified via email when the stock price hits the desired alert level. The app utilizes Socket.io for real-time stock updates and Nodemailer for sending email alerts.


Features--
-Real-Time Stock Prices: Fetches real-time stock prices using a stock API (Finnhub).
-Price Alerts: Users can set multiple price alerts for each stock.
-Email Notifications: Sends email notifications when a stock hits the set alert price.
-User Authentication: Allows users to sign up, log in, and track stocks tied to their account.


-Tech Stack
-Backend: Node.js, Express, MongoDB (Mongoose), Socket.io, Nodemailer
-Frontend: React, Axios
-Database: MongoDB (with MongoDB Atlas)
-Email Service: Nodemailer (configured with Gmail, Outlook, or any other SMTP)



-Project Structure
-bash
-Copy code
├── backend/
│   ├── config/                 # MongoDB connection configuration
│   ├── helpers/                # Email service, Stock price fetching service
│   ├── models/                 # Mongoose schemas (User, Stock)
│   ├── routes/                 # API routes (auth, stock tracking, etc.)
│   ├── app.js                  # Main Express application
│   └── server.js               # Entry point for the backend server
├── frontend/
│   ├── src/
│   │   ├── components/         # React components (StockTracker, SignIn, SignUp, etc.)
│   │   ├── App.js              # Main React App component
│   │   └── index.js            # ReactDOM render
│   ├── public/                 # Public assets (index.html, styles)
│   └── package.json            # Frontend dependencies
├── .env                        # Environment variables (API keys, DB connection, etc.)
└── README.md                   # Project documentation




Setup Instructions--
Prerequisites
Node.js (v14.x or later)
MongoDB Atlas (or local MongoDB)
SendGrid / Nodemailer SMTP credentials (for email notifications)
Stock API Key (Finnhub, Alpha Vantage, etc.)
Step 1: Clone the Repository
bash
Copy code
git clone https://github.com/yourusername/real-time-stock-tracker.git
cd real-time-stock-tracker
Step 2: Install Dependencies
Backend
bash
Copy code
cd backend
npm install
Frontend
bash
Copy code
cd frontend
npm install
Step 3: Set Up Environment Variables
Create a .env file in the backend folder and configure the following variables:

plaintext
Copy code
# MongoDB
MONGO_URI=mongodb+srv://<your-mongodb-url>

# API Keys
FINNHUB_API_KEY=your_finnhub_api_key
SENDGRID_API_KEY=your_sendgrid_api_key

# Nodemailer Email Credentials (if not using SendGrid)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Other settings
PORT=5001
Step 4: Run the Backend Server
bash
Copy code
cd backend
npm run dev
This will start the backend on http://localhost:5001.

Step 5: Run the Frontend (React)
bash
Copy code
cd frontend
npm start
This will start the React frontend on http://localhost:3000.

Step 6: Access the Application
Navigate to http://localhost:3000 in your browser to access the application.

Testing
You can test the email functionality by setting a price alert for any stock. When the stock reaches the alert price, you should receive an email notification.

Postman Testing
You can use Postman to test the backend APIs, such as user authentication, stock tracking, and email notifications.

To-Do Features
Improve the frontend design and user experience.
Add support for additional stock APIs.
Implement pagination for tracked stocks.
Improve error handling and validation.
License
This project is licensed under the MIT License - see the LICENSE file for details.
