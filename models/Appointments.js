const mongoose = require('mongoose')
const AppointmentsSchema = new mongoose.Schema({
    identity:{
        type: String, 
        require: true
    }, 
    baby_id:{
        // type: mongoose.Schema.Types.ObjectId,
        // require: true , 
        // ref: "Babies"
                type: String

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
        // date:{ type:Date ,require: true  }
        date:{ type:Number ,require: true  }

   }
})

module.exports= mongoose.model('Appointments', AppointmentsSchema)