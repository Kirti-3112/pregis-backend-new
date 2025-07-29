const multer = require('multer');

const uploadExcel = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (['xls', 'xlsx'].includes(ext)) cb(null, true);
    else cb(new Error('Only Excel files are allowed'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadExcel;
