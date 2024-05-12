const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
  
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Only JPEG and PNG images are allowed');
      error.code = 'FILE_TYPE';
      return cb(error, false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5 
  }
});

module.exports = upload;
