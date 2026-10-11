const KnowledgeBase = require('../models/KnowledgeBase');

// @desc Get all knowledge base articles
// @route GET /api/v1/kb
exports.getAllKB = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && category !== 'All') filter.category = category;
    if (search) {
      filter.$or = [
        { errorCode: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { detectionKeywords: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await KnowledgeBase.find(filter).sort({ errorCode: 1 });
    res.json({ success: true, count: articles.length, articles });
  } catch (error) {
    next(error);
  }
};

// @desc Get single KB article
// @route GET /api/v1/kb/:id
exports.getKBById = async (req, res, next) => {
  try {
    const article = await KnowledgeBase.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'KB Article not found' });
    }
    res.json({ success: true, article });
  } catch (error) {
    next(error);
  }
};

// @desc Create KB article
// @route POST /api/v1/kb
exports.createKB = async (req, res, next) => {
  try {
    const { errorCode, title, category, symptoms, detectionKeywords, resolutionSteps, suggestedCommands, escalateIf } = req.body;

    const count = await KnowledgeBase.countDocuments();
    const kbId = `KB-${category ? category.substring(0, 3).toUpperCase() : 'SYS'}-${String(count + 101).padStart(3, '0')}`;

    const article = await KnowledgeBase.create({
      kbId,
      errorCode,
      title,
      category: category || 'Network',
      symptoms: Array.isArray(symptoms) ? symptoms : [symptoms],
      detectionKeywords: Array.isArray(detectionKeywords) ? detectionKeywords : (detectionKeywords ? detectionKeywords.split(',').map(s => s.trim()) : []),
      resolutionSteps: Array.isArray(resolutionSteps) ? resolutionSteps : [resolutionSteps],
      suggestedCommands: Array.isArray(suggestedCommands) ? suggestedCommands : (suggestedCommands ? suggestedCommands.split(',').map(s => s.trim()) : []),
      escalateIf: escalateIf || 'If symptoms persist after executing diagnostics',
    });

    res.status(201).json({ success: true, message: 'Knowledge base article created', article });
  } catch (error) {
    next(error);
  }
};

// @desc Delete KB article
// @route DELETE /api/v1/kb/:id
exports.deleteKB = async (req, res, next) => {
  try {
    const article = await KnowledgeBase.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, message: 'KB article deleted' });
  } catch (error) {
    next(error);
  }
};
