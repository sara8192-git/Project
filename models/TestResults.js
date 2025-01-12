const mongoose = require('mongoose')
const {format}=require('date-fns')
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
        day :{ type: Date, format:('dd-MM-yyyy'), required: true }
       
    },
    result:{
        //object
        type: Number, 
        require: true 
    }
}
,{timestamps:true})

module.exports= mongoose.model('TestResults', TestResultsSchema)