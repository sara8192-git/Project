const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    identity:{
        type: String, 
        require: true
    }, 
    name:{
        type: String, 
        require: true
    }, 
    email:{
        type: String, 
        require: true 
    },
    password:{
        type: String, 
        require: true 
    },
    role: {
        type: String,
        enum: ['Secretary','Parent','Nurse','Admin','guest'] ,
        require: true 
       
        }
  
}
,{timestamps:true})

module.exports= mongoose.model('User', UserSchema)