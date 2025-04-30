const multer = require('multer');
const path = require('path');

// הגדרת אחסון הקבצים
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // שמירת קבצים בתיקיית uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueSuffix); // שם ייחודי לכל קובץ
    },
});

// סינון קבצים (רק תמונות)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // קובץ מאושר
    } else {
        cb(new Error('Only image files are allowed!'), false); // דחיית קובץ שאינו תמונה
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // מגבלת גודל קובץ: 5MB
});

module.exports = upload;