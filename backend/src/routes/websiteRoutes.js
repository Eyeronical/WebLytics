const express = require('express');
const router = express.Router();
const { analyzeAndStore, getAll, getById, update, remove, getStats } = require('../services/websiteService');

router.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Valid URL is required' });
    }

    const urlPattern = /^https?:\/\/.+\..+/i;
    if (!urlPattern.test(url.trim())) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const result = await analyzeAndStore(url.trim());
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Analyze error:', error.message);
    res.status(500).json({ 
      error: 'Failed to analyze website',
      message: error.message 
    });
  }
});

router.get('/websites', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const search = req.query.search || '';

    const result = await getAll(page, limit, search);
    res.json(result);
  } catch (error) {
    console.error('Get websites error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch websites',
      message: error.message 
    });
  }
});

router.get('/websites/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || id <= 0) {
      return res.status(400).json({ error: 'Valid website ID is required' });
    }

    const website = await getById(id);
    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    res.json(website);
  } catch (error) {
    console.error('Get website error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch website',
      message: error.message 
    });
  }
});

router.put('/websites/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || id <= 0) {
      return res.status(400).json({ error: 'Valid website ID is required' });
    }

    const updates = req.body;
    const allowedFields = ['brand_name', 'description', 'ai_description', 'keywords', 'language'];
    const filteredUpdates = {};
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updatedWebsite = await update(id, filteredUpdates);
    res.json({ success: true, data: updatedWebsite });
  } catch (error) {
    console.error('Update website error:', error.message);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Website not found' });
    }
    res.status(500).json({ 
      error: 'Failed to update website',
      message: error.message 
    });
  }
});

router.delete('/websites/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id || id <= 0) {
      return res.status(400).json({ error: 'Valid website ID is required' });
    }

    await remove(id);
    res.json({ success: true, message: 'Website deleted successfully' });
  } catch (error) {
    console.error('Delete website error:', error.message);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: 'Website not found' });
    }
    res.status(500).json({ 
      error: 'Failed to delete website',
      message: error.message 
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      message: error.message 
    });
  }
});

module.exports = router;
