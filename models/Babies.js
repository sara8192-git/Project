const mongoose = require('mongoose')
const {format}=require('date-fns')
const BabiesSchema = new mongoose.Schema({
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
        format:("dd-MM-yyyy") ,
        require: true 
    }, 
    parent_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true , 
        ref: "User"
    }
})

module.exports= mongoose.model('Babies', BabiesSchema)