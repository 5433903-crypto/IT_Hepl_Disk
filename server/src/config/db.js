const mongoose = require('mongoose');

let isConnecting = false;

// Setup Mongoose connection lifecycle listeners once
mongoose.connection.on('connected', () => {
  console.log(`[Database] MongoDB Connected to host: ${mongoose.connection.host}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database Error] MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[Database Warning] MongoDB disconnected. Mongoose will attempt to reconnect...');
});

const connectDB = async (retryCount = 0) => {
  if (mongoose.connection.readyState === 1 || isConnecting) {
    return mongoose.connection;
  }

  isConnecting = true;
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_it_helpdesk';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      maxPoolSize: 10,
    });
    isConnecting = false;
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`[Database Error] Connection attempt failed: ${error.message}`);
    
    // Schedule background retry with exponential backoff (capped at 30s)
    const delay = Math.min(5000 * Math.pow(1.5, retryCount), 30000);
    console.log(`[Database] Retrying connection in ${(delay / 1000).toFixed(0)}s (attempt ${retryCount + 1})...`);
    
    setTimeout(() => {
      connectDB(retryCount + 1).catch((err) => {
        console.error(`[Database Retry Error] ${err.message}`);
      });
    }, delay);

    // Return null instead of throwing to avoid crashing the server process
    return null;
  }
};

module.exports = connectDB;

