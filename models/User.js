const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    identity:{
        type: String, 
        require: true
    }, 
    Name:{
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
        enum: ['Secretary','Parent','Nurse','Admin'],
        }

    
}
,{timestamps:true})

module.exports= mongoose.model('User', UserSchema)