const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const User = require('./models/User');
const { seedData } = require('./seeds/seedData');

// Route imports
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const outageRoutes = require('./routes/outageRoutes');
const labRoutes = require('./routes/labRoutes');
const kbRoutes = require('./routes/kbRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const systemRoutes = require('./routes/systemRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static uploads folder for screenshots
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount API routes under /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/outages', outageRoutes);
app.use('/api/v1/labs', labRoutes);
app.use('/api/v1/kb', kbRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/system', systemRoutes);

// Dedicated health check endpoint (essential for Render wake-up and uptime monitoring)
app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(isDbConnected ? 200 : 503).json({
    status: isDbConnected ? 'UP' : 'DEGRADED',
    system: 'Campus IT Help Desk & Automated Lab Monitor',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: {
      status: isDbConnected ? 'connected' : 'disconnected',
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
    },
  });
});

// API status route
app.get('/api', (req, res) => {
  res.json({
    message: 'Campus IT Help Desk & Automated Lab Monitor REST API is operational',
    version: '2.4.0',
    documentation: '/api/v1/system/health',
  });
});

// Serve frontend static build if it exists
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      message: 'Campus IT Help Desk & Automated Lab Monitor REST API is operational',
      version: '2.4.0',
      documentation: '/api/v1/system/health',
    });
  });
}

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start HTTP server immediately to bind port and satisfy hosting wake-up checks
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`================================================================`);
  console.log(`🚀 Campus IT Help Desk Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Base API URL: http://0.0.0.0:${PORT}/api/v1`);
  console.log(`💓 Health Check: http://0.0.0.0:${PORT}/health`);
  console.log(`📂 Static Uploads: http://0.0.0.0:${PORT}/uploads`);
  console.log(`================================================================`);
});

// Asynchronously connect to Database and auto-seed initial data when ready
const initDatabase = async () => {
  try {
    const conn = await connectDB();
    if (conn && mongoose.connection.readyState === 1) {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[System] First-time setup detected. Initializing database with demo college records...');
        await seedData();
      }
    }
  } catch (err) {
    console.error('[Database Init Warning] Auto-seed deferred due to connection state:', err.message);
  }
};

initDatabase();

// Handle graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n[System] Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    console.log('[System] HTTP server closed.');
    try {
      await mongoose.connection.close(false);
      console.log('[System] MongoDB connection closed.');
    } catch (err) {
      console.error('[System] Error closing MongoDB connection:', err.message);
    }
    process.exit(0);
  });

  // Force exit after 10s if graceful shutdown hangs
  setTimeout(() => {
    console.error('[System] Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

