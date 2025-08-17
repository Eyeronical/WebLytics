const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/websiteController');

router.post('/analyze', websiteController.analyzeWebsite);
router.get('/websites', websiteController.getWebsites);
router.get('/websites/:id', websiteController.getWebsite);
router.put('/websites/:id', websiteController.updateWebsite);
router.delete('/websites/:id', websiteController.deleteWebsite);
router.get('/stats', websiteController.getStats);

module.exports = router;
