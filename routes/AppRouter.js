var express = require('express');
const employeeController = require('../controllers/EmployeeController');
const authMiddleware = require('../middleware/userAuth');
const validateMiddleware = require('../middleware/validate');
const validationSchemas = require('../validations/validationSchema');
var router = express.Router();
const multer = require('multer');
const path = require('path');
// Multer storage configuration for file uploads
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads/'),
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed.'), false);
    }
  };
  
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });
//---------------------------------------Auth CONTROLLER------------------------------------------------------
router.post('/login', validateMiddleware.validateSchema(validationSchemas.loginSchema), employeeController.login);
router.post('/register', validateMiddleware.validateSchema(validationSchemas.registerSchema), employeeController.register);
router.get('/profile',authMiddleware.verifyToken, employeeController.profile);
router.post('/upload',authMiddleware.verifyToken, upload.array('documents'), employeeController.upload);
router.get('/download/:id',authMiddleware.verifyToken, employeeController.download);
router.get('/documents',authMiddleware.verifyToken, employeeController.documents);
module.exports = router