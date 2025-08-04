const express = require('express');
const { uploadMiddleware } = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// All upload routes require authentication
router.use(verifyToken);

// Upload warranty document
router.post('/', uploadMiddleware, uploadController.uploadWarranty);

// Get user's warranties
router.get('/warranties', uploadController.getUserWarranties);

// Get specific warranty details
router.get('/warranty/:id', uploadController.getWarrantyDetails);

module.exports = router;
