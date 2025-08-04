const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.memoryStorage();

//file filter to allow images and pdfs only
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and PDF files are allowed"),
      false
    );
  }
}

  // Multer configuration
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fieSize: 5 * 1024 * 1024,
      files: 1,
    },
  });

//Single file upload middleware
const uploadSingle = upload.single("warranty");
//Error handling
const uploadMiddleware = (req, res, next) => {
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "File too large. Maximum size limit is 5MB.",
        });
      }

      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          success: false,
          message: "Too many files. Only one file allowed.",
        });
      }
    }
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select a warranty document.",
      });
    }

    //Generate unique filename
    const fileExtension = req.file.originalname.split(".").pop();
    req.file.uniqueName = `${uuidv4()}.${fileExtension}`;
    next();
  });
};

module.exports = { uploadMiddleware };
