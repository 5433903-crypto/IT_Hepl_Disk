const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_it_helpdesk', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failure: ${error.message}`);
    console.error(`Ensure MongoDB service is running on mongodb://127.0.0.1:27017`);
    throw error;
  }
};

module.exports = connectDB;
