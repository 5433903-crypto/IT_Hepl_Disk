const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
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
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
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

// Connect to Database & Auto-Seed if empty
connectDB()
  .then(async () => {
    // Check if users exist, otherwise auto-seed initial college data
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[System] First-time setup detected. Initializing database with demo college records...');
      await seedData();
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`================================================================`);
      console.log(`🚀 Campus IT Help Desk Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 Base API URL: http://localhost:${PORT}/api/v1`);
      console.log(`📂 Static Uploads: http://localhost:${PORT}/uploads`);
      console.log(`================================================================`);
    });
  })
  .catch((err) => {
    console.error('[Fatal Error] Failed to start server:', err.message);
    process.exit(1);
  });
