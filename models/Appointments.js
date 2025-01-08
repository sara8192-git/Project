const mongoose = require('mongoose')
const AppointmentsSchema = new mongoose.Schema({
    identity:{
        type: String, 
        require: true
    }, 
    baby_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true , 
        ref: "Babies"
    },
    nurse_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true , 
        ref: "User"
    } ,
    status: {
        type: Boolean,
        enum: ['canceled','completed','confirmed','pending'],
        default:false
        },
   appointment_time:{
        time:{ type:Number ,require: true  },
        date:{ type:Date ,require: true  }
   }
})

module.exports= mongoose.model('Appointments', AppointmentsSchema)