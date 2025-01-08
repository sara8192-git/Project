const mongoose = require('mongoose')
const UsersSchema = new mongoose.Schema({
    identity:{
        type: String, 
        require: true
    }, 
    name:{
        type: String, 
        require: true
    }, 
    dob:{
        type: Date, 
        require: true 
    }, 
    parent_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true , 
        ref: "Parent"
    }, 
    phone:{
        type: String, 
        maxLength:10
    }
})

module.exports= mongoose.model('User', UsersSchema)