const mongoose = require('mongoose');

// Replace this with your MongoDB URI
const uri = process.env.MONGO_URI;

const testConnection = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

testConnection();
