import multer from 'multer';
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
  
  const fileExt = file.originalname.split('.').pop().toLowerCase();

  if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type or extension. Only JPEG, PNG, WEBP and PDF are allowed.'), false);
  }
};

export const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});
