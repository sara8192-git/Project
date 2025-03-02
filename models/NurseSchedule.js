const mongoose = require('mongoose')
const {format}=require('date-fns')
const NurseScheduleSchema = new mongoose.Schema({
    nurse_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true , 
        ref: "User"
    }, 
    working_day:{
        type: Date, 
        format:('dd-MM-yyyy'),
        required: true
    }, 
    satrt_time:{
        type: Number,
        required: true 
    }, 
    end_time:{
        type: Number,
        required: true 
    }
}, { timestamps: true })

module.exports= mongoose.model('NurseSchedule', NurseScheduleSchema)