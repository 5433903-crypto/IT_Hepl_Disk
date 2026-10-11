const { seedData } = require('../seeds/seedData');
const mongoose = require('mongoose');

// @desc Re-seed database with realistic demo data for college demonstration
// @route POST /api/v1/system/seed
exports.seedDatabase = async (req, res, next) => {
  try {
    const result = await seedData();
    res.json({
      success: true,
      message: 'Campus IT Help Desk database seeded successfully!',
      details: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Health check and system configuration summary
// @route GET /api/v1/system/health
exports.getHealth = async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const hasOpenAIKey = !!(
      process.env.OPENAI_API_KEY &&
      process.env.OPENAI_API_KEY.trim().length > 10 &&
      !process.env.OPENAI_API_KEY.includes('your-openai-api-key')
    );

    res.json({
      success: true,
      system: 'Campus IT Help Desk & Automated Lab Monitor',
      version: '2.4.0',
      status: isDbConnected ? 'Healthy' : 'Database Disconnected',
      database: {
        connected: isDbConnected,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      },
      visionAi: {
        provider: hasOpenAIKey ? 'OpenAI Vision API (gpt-4o-mini)' : 'Knowledge Base Fallback Engine',
        isExternalAiActive: hasOpenAIKey,
        isFallbackEngineActive: !hasOpenAIKey,
        modeDescription: hasOpenAIKey
          ? 'Live neural network vision OCR active via OpenAI API.'
          : 'High-speed pre-indexed campus Knowledge Base diagnostic engine active (Transparent Fallback).',
      },
      timestamp: new Date(),
    });
  } catch (error) {
    next(error);
  }
};
