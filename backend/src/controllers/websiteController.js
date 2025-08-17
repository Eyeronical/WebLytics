const { analyzeAndStore, getAll, getById, update, remove, getStats } = require('../services/websiteService');
const { validateUrl, validateId, validateUpdateData } = require('../utils/validators');

exports.analyzeWebsite = async (req, res, next) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const validation = validateUrl(url);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const entry = await analyzeAndStore(validation.url);
    res.status(201).json(entry);
  } catch (error) {
    if (error.message.includes('timeout')) {
      return res.status(408).json({ error: 'Website took too long to respond' });
    }
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      return res.status(404).json({ error: 'Website not accessible' });
    }
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      return res.status(403).json({ error: 'Website blocked access' });
    }
    next(error);
  }
};

exports.getWebsites = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const data = await getAll(parseInt(page), parseInt(limit), search);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.getWebsite = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!validateId(id)) {
      return res.status(400).json({ error: 'Invalid website ID' });
    }

    const data = await getById(id);
    if (!data) {
      return res.status(404).json({ error: 'Website not found' });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateWebsite = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!validateId(id)) {
      return res.status(400).json({ error: 'Invalid website ID' });
    }

    const validation = validateUpdateData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const data = await update(id, validation.data);
    if (!data) {
      return res.status(404).json({ error: 'Website not found' });
    }
    res.json(data);
  } catch (error) {
    next(error);
  }
};

exports.deleteWebsite = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!validateId(id)) {
      return res.status(400).json({ error: 'Invalid website ID' });
    }

    await remove(id);
    res.json({ message: 'Website deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
