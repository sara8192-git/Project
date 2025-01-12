const TestResults = require("../models/TestResults")

const creatTestResults = async (req, res) => {
    {
        const {baby_id, nurse_id, test_date, result} = req.body
        if (!baby_id || !nurse_id || !test_date || !result)
            return res.status(400).json({ message:'Mandatory fields' })
        const testResults = await TestResults.create({baby_id, nurse_id, test_date, result})
        if (testResults) {
            return res.status(201).json({ message: 'New testResults created' })
        }
        else {
            return res.status(400).json({ message: 'Invalid testResults ' })
        }
    }
}

const getAllTestResults = async (req, res) => {
    const testResults = await TestResults.find().lean()
    if (!testResults?.length) {
        return res.status(400).json({ message: 'No testResults found' })
    }
    res.json(testResults)
}


const updateTestResults = async (req, res) => {
    const {baby_id, nurse_id, test_date, result,_id} = req.body

    if (!_id) {
        return res.status(400).json({ message: "There is no testResults with this id" })
    }

    const testResult = await TestResults.findById(_id).exec()
    if (!testResult) {
        return res.status(400).json({ message: 'testResult not found' })
    }
    if(baby_id)
        testResult.baby_id = baby_id
    if(nurse_id)
        testResult.nurse_id = nurse_id
    if(test_date)
        testResult.test_date = test_date
    if(result)
        testResult.result = result
    const updateTestResults = await testResult.save()
    res.json(`updated!!`)
}


const deleteTestResults = async (req, res) => {
    const {_id} = req.params
    const testResults = await TestResults.findById(_id).exec()
    if (!testResults) {
        return res.status(400).json({ message: 'testResults not found' })
    }
    const result = await TestResults.deleteOne()
    const reply = ` ID ${_id} deleted`
    res.json(reply)
}


const getTestResultById = async (req, res) => {
    const {_id} = req.params
    const testResults = await TestResults.findById(_id).lean()
    if (!testResults) {
        return res.status(400).json({ message: 'No testResults found' })
    }
    res.json(testResults)
}


module.exports = {
    getAllTestResults,
    creatTestResults,
    getTestResultById,
    updateTestResults,
    deleteTestResults
   // 
}