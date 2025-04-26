const multer = require('multer');
const path = require('path');

// הגדרת אחסון הקבצים
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // הגדרת התיקייה שבה יאוחסנו הקבצים
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // שמירת הקובץ עם תאריך ושם קובץ ייחודי
  }
});

// הגדרת סוג הקבצים המותר (כדי לאפשר רק PDFים לדוגמה)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // אם הקובץ הוא PDF
  } else {
    cb(new Error('Only PDF files are allowed!'), false); // אם הקובץ לא PDF
  }
};

// יצירת האובייקט של multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // הגבלת גודל הקובץ (למשל, 10MB)
});

module.exports = upload;
