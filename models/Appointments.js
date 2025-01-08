const mongoose = require('mongoose')
const {format}=require('date-fns')
const AppointmentsSchema = new mongoose.Schema({
    identity:{
        type: String, 
        require: true
    }, 
    baby_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true, 
        ref: "Babies"

    },
    nurse_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true , 
        ref: "User"
        // type: String

    } ,
    status: {
        type: String,
        enum: ['canceled','completed','confirmed','pending']
        },
   appointment_time:{
        time:{ type:Number ,require: true  },
        date:{ type:Date , format:("dd-MM-yy") ,require: true  }

   }
})

module.exports= mongoose.model('Appointments', AppointmentsSchema)