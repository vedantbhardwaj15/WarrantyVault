const Warranty = require('../models/Warranty');
const s3Service = require('../config/aws');
const ocrService = require('../services/ocrService');

// Utility function to calculate warranty status
function getWarrantyStatus(warrantyExpiryDate) {
  if (!warrantyExpiryDate) return { expired: null, daysLeft: null };

  const expiry = new Date(warrantyExpiryDate);
  const today = new Date();
  // Zero out time to avoid partial-day issues
  expiry.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diffMs = expiry - today;
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return {
    expired: daysLeft < 0,
    daysLeft: daysLeft < 0 ? 0 : daysLeft
  };
}

class UploadController {
  // Upload warranty document (PDF or image)
  async uploadWarranty(req, res) {
    try {
      const userId = req.user.userId;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      console.log(`Processing upload from user ${userId}: ${file.originalname}`);

      // Upload file to S3
      const s3Result = await s3Service.uploadFile(file, file.uniqueName);

      if (!s3Result.success) {
        return res.status(500).json({ success: false, message: 'Failed to upload file' });
      }
      console.log(`File uploaded to S3: ${s3Result.url}`);

      // Extract warranty data using Gemini Vision
      let extractedData;
      try {
        extractedData = await ocrService.extractWarrantyDetails(file);
        if (!extractedData) throw new Error('No data extracted');
      } catch (e) {
        return res.status(500).json({
          success: false,
          message: 'Failed to extract warranty data',
          error: String(e.message || e)
        });
      }

      // Map extracted fields, handle alternative field names gracefully
      const warranty = new Warranty({
        userId,
        fileName: file.originalname,
        imageUrl: s3Result.url,
        s3Key: s3Result.key,
        isProcessed: true,
        processingStatus: 'completed',
        brand: extractedData.brand || '',
        productName: extractedData.productName || '',
        model: extractedData.model || '',
        serialNumber: extractedData.serialNumber || '',
        purchaseDate: extractedData.purchaseDate ? new Date(extractedData.purchaseDate) : null,
        warrantyDuration: extractedData.warrantyDuration || extractedData.warrantyPeriod || '',
        warrantyExpiryDate: extractedData.warrantyExpiryDate
          ? new Date(extractedData.warrantyExpiryDate)
          : (extractedData.expiryDate ? new Date(extractedData.expiryDate) : null),
        extractedData: {
          aiSource: 'Gemini-Pro-Vision',
          raw: extractedData,
        }
      });

      await warranty.save();

      // Add status to the API response
      const status = getWarrantyStatus(warranty.warrantyExpiryDate);

      return res.json({
        success: true,
        warranty: {
          ...warranty.toObject(),
          warrantyStatus: status // {expired: true/false/null, daysLeft:number|null}
        }
      });

    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during warranty upload',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get all warranties for this user, each with live status calculation
  async getUserWarranties(req, res) {
    try {
      const userId = req.user.userId;
      const warranties = await Warranty.find({ userId }).sort({ createdAt: -1 });

      // Map status onto each warranty
      const enhancedWarranties = warranties.map(w => ({
        ...w.toObject(),
        warrantyStatus: getWarrantyStatus(w.warrantyExpiryDate)
      }));

      return res.json({
        success: true,
        count: warranties.length,
        warranties: enhancedWarranties
      });
    } catch (error) {
      console.error('Fetch warranties error:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch warranties' });
    }
  }

  // Get a single warranty by ID (with warranty status and signed S3 URL)
  async getWarrantyDetails(req, res) {
    try {
      const userId = req.user.userId;
      const warrantyId = req.params.id;

      const warranty = await Warranty.findOne({ _id: warrantyId, userId });
      if (!warranty) {
        return res.status(404).json({ success: false, message: 'Warranty not found' });
      }

      const signedUrl = s3Service.getSignedUrl(warranty.s3Key);
      const status = getWarrantyStatus(warranty.warrantyExpiryDate);

      return res.json({
        success: true,
        warranty: {
          ...warranty.toObject(),
          signedUrl,
          warrantyStatus: status
        }
      });
    } catch (error) {
      console.error('Warranty details error:', error);
      return res.status(500).json({ success: false, message: 'Failed to get warranty details' });
    }
  }
}

module.exports = new UploadController();
