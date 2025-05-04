const TestResults = require("../models/TestResults")
const multer = require('multer');
const path = require('path');



  
const creatTestResults = async (req, res) => {
    try {
        const { baby_id, nurse_id, test_date, result } = req.body;
        if (!baby_id || !nurse_id || !test_date || !result) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newTestResult = new TestResults({
            baby_id,
            nurse_id,
            test_date,
            result
        });

        const savedTestResult = await newTestResult.save();
        res.status(201).json(savedTestResult);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating test result', error });
    }
};

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

const checkIfReported = async (req, res) => {
    try {
        const { appointmentId } = req.query;

        if (!appointmentId) {
            return res.status(400).json({ message: 'Appointment ID is required' });
        }

        const reportExists = await TestResults.exists({ appointment_id: appointmentId });

        res.status(200).json({ reported: !!reportExists });
    } catch (error) {
        res.status(500).json({ message: 'Error checking report status', error: error.message });
    }
};



module.exports = {
    getAllTestResults,
    creatTestResults,
    getTestResultById,
    updateTestResults,
    deleteTestResults,
    checkIfReported
    // 
}