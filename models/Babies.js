const mongoose = require('mongoose')
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
        require: true 
    }, 
    parent_id:{
        type: mongoose.Schema.Types.ObjectId,
        require: true , 
        ref: "Parent"
    }
})

module.exports= mongoose.model('Babies', BabiesSchema)