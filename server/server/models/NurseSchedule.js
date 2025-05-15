const mongoose = require('mongoose')
const {format}=require('date-fns')
const NurseScheduleSchema = new mongoose.Schema({
    identity:{
        type: mongoose.Schema.Types.ObjectId,
        required: true , 
        ref: "User"
    }, 
    working_day:{
        type: Date, 
        format:('YYYY-MM-DD'),
        required: true
    }, 
    available_slots: [{  
        time: String, 
        is_booked: { type: Boolean, default: false }
    }]
    // satrt_time:{
    //     type: Number,
    //     required: true 
    // }, 
    // end_time:{
    //     type: Number,
    //     required: true 
    // }
}, { timestamps: true })

module.exports= mongoose.model('NurseSchedule', NurseScheduleSchema)