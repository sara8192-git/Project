const TestResults = require("../models/TestResults")

const creatTestResults = async (req, res) => {
    try {
        const { patient_id, test_type, result, date } = req.body
        if (!patient_id || !test_type || !result || !date) {
            return res.status(400).json({ message: 'patient_id, test_type, result, and date are required' })
        }

        // בדיקת קיום תוצאה קודמת עבור החולה
        const existingResult = await TestResult.findOne({ patient_id, test_type, date })
        if (existingResult) {
            return res.status(400).json({ message: 'Test result already exists for this patient on this date' })
        }

        const testResult = await TestResult.create({ patient_id, test_type, result, date })
        return res.status(201).json({ message: 'New test result created', testResult })
    } catch (error) {
        return res.status(500).json({ message: 'Error creating test result', error })
    }
}

const getAllTestResults = async (req, res) => {
    try {
        const testResults = await TestResult.find().lean()
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

        const testResult = await TestResult.findById(_id).exec()
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

        const testResult = await TestResult.findById(_id).exec()
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

        const testResult = await TestResult.findById(_id).lean()
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