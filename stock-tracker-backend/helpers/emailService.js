// helpers/emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,  // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,  // Your email here
    pass: process.env.EMAIL_PASS   // Your email password or app password here
  },
  tls: {
    rejectUnauthorized: false  // Allow self-signed certificates if applicable
  },
  connectionTimeout: 5000,  // Set the timeout to 5 seconds (or more if needed)
  timeout: 20000  // Overall timeout (20 seconds)
});

const sendPriceAlertEmail = async (email, symbol, alertPrice, currentPrice) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Price Alert for ${symbol}`,
    text: `The stock price of ${symbol} has reached your alert price of $${alertPrice}. Current price is $${currentPrice}.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendPriceAlertEmail };
