const mongoose = require('mongoose')

const TestResultsSchema = new mongoose.Schema({
    baby_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Babies"
    },
    nurse_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    test_date: {
        time: { type: String, required: true },
        day: { type: Date, format: ('dd-MM-yyyy'), required: true }

    },
    result: {
        type: String,
        required: true,
    }
}
    , { timestamps: true })

module.exports = mongoose.model('TestResults', TestResultsSchema)