const mongoose = require('mongoose')
const TestResultsSchema = new mongoose.Schema({
    baby_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true , 
        ref: "Babies"
    }, 
    nurse_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true , 
        ref: "User"
    }, 
    test_date:{
        time:{ type: Number, required: true },
        day :{ type: Date, required: true }, 
        require: true 
    },
    result:{
        type: Object, 
        require: true 
    }
}
,{timestamps:true})

module.exports= mongoose.model('TestResults', TestResultsSchema)