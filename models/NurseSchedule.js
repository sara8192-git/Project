const mongoose = require('mongoose')
const NurseScheduleSchema = new mongoose.Schema({
    nurse_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true , 
        ref: "User"
    }, 
    working_day:{
        type: Date, 
        require: true
    }, 
    satrt_time:{
        type: Number,
        require: true 
    }, 
    end_time:{
        type: Number,
        require: true 
    }
})

module.exports= mongoose.model('NurseSchedule', NurseScheduleSchema)