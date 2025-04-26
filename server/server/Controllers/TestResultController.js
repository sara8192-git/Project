const TestResults = require("../models/TestResults")
const multer = require('multer');
const path = require('path');

const fileTypes = ['image/jpeg', 'image/png', 'application/pdf']; // הוסיפו סוגי קבצים נוספים אם רוצים

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
 
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (!fileTypes.includes(file.mimetype)) {
        return cb(new Error('File type not allowed'), false);
      }
      cb(null, true);
    },
  }).single('file');
  
const creatTestResults = async (req, res) => {
    try {
        const { baby_id, nurse_id, test_date, result } = req.body
        if (!baby_id || !nurse_id || !test_date || !result) {
            return res.status(400).json({ message: 'patient_id, test_type, result, and date are required' })
        }
        let filePath = null;
        if (req.result) {
            filePath = req.result.path;
        }
        // בדיקת קיום תוצאה קודמת עבור החולה
        // const existingResult = await TestResults.findOne({ patient_id, test_type, date })
        // if (existingResult) {
        //     return res.status(400).json({ message: 'Test result already exists for this patient on this date' })
        // }
        const newTestResult = new TestResults({
            baby_id,
            nurse_id,
            test_date,
            result:filePath,
        });
        const savedTestResult = await newTestResult.save();
        res.status(201).json(savedTestResult);

        // const testResult = await TestResults.create({ patient_id, test_type, result, date })
        // return res.status(201).json({ message: 'New test result created', testResult })
    } catch (error) {
        return res.status(500).json({ message: 'Error creating test result', error })
    }
}

const getAllTestResults = async (req, res) => {
    try {
        const testResults = await TestResults.find().lean()
        if (!testResults?.length) {
            return res.status(400).json({ message: 'No test results found' })
        }
        res.json(testResults)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching test results', error })
    }
}


const updateTestResults = async (req, res) => {
    try {
        const { _id, patient_id, test_type, result, date } = req.body

        if (!_id) {
            return res.status(400).json({ message: 'Test result ID is required' })
        }

        const testResult = await TestResults.findById(_id).exec()
        if (!testResult) {
            return res.status(400).json({ message: 'Test result not found' })
        }

        testResult.patient_id = patient_id || testResult.patient_id
        testResult.test_type = test_type || testResult.test_type
        testResult.result = result || testResult.result
        testResult.date = date || testResult.date

        const updatedTestResult = await testResult.save()

        return res.status(200).json({ message: `'${updatedTestResult.test_type}' test result updated`, updatedTestResult })
    } catch (error) {
        return res.status(500).json({ message: 'Error updating test result', error })
    }
}


const deleteTestResults = async (req, res) => {
    try {
        const { _id } = req.params

        if (!_id) {
            return res.status(400).json({ message: 'Test result ID is required' })
        }

        const testResult = await TestResults.findById(_id).exec()
        if (!testResult) {
            return res.status(400).json({ message: 'Test result not found' })
        }

        await testResult.deleteOne()
        return res.status(200).json({ message: `Test result with ID ${_id} deleted` })
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting test result', error })
    }
}

// קבלת תוצאות בדיקות לפי מזהה חולה
const getTestResultById = async (req, res) => {
    try {
        const { _id } = req.params

        if (!_id) {
            return res.status(400).json({ message: 'Test result ID is required' })
        }

        const testResult = await TestResults.findById(_id).lean()
        if (!testResult) {
            return res.status(400).json({ message: 'No test result found' })
        }
        res.json(testResult)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching test result', error })
    }
}




module.exports = {
    getAllTestResults,
    creatTestResults,
    getTestResultById,
    updateTestResults,
    deleteTestResults,
    // 
}