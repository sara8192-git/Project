const mongoose = require('mongoose')
const {format}=require('date-fns')
const AppointmentsSchema = new mongoose.Schema({
    identity:{
        type: String, 
        required: true
    }, 
    baby_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Babies"

    },
    nurse_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
        // type: String

    },
    status: {
        type: String,
        enum: ['canceled','completed','confirmed','pending'],
        default: 'pending' 
        },
   appointment_time:{
        time:{ type:Number ,require: true  },
        date:{ type:Date , format:("dd-MM-yy") ,require: true  }

    }
}, { timestamps: true })

module.exports = mongoose.model('Appointment', AppointmentsSchema)