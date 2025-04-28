const mongoose = require('mongoose')
const {format}=require('date-fns')

const BabiesSchema = new mongoose.Schema({
    identity:{
        type: String, 
        required: true
    }, 
    name:{
        type: String, 
        required: true
    }, 
    dob:{
        type: Date,
        format:("dd-MM-yyyy") ,
        required: true 
    }, 
    parent_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true , 
        ref: "User"
    },
    messure: [
        {
            height: { type: Number, required: true },
            weight: { type: Number, required: true }
        }
    ]


}, { timestamps: true })

module.exports= mongoose.model('Babies', BabiesSchema)