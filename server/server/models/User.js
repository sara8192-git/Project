const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    identity:{
        type: String, 
        required: true
    }, 
    name:{
        type: String, 
        required: true
    }, 
    email:{
        type: String, 
        required: true 
    },
    password:{
        type: String, 
        required: true 
    },
    role: {
        type: String,
        enum: ['Secretary','Parent','Nurse','Admin'] ,
        default: 'Parent' 

        },
        babies: [{
            type: mongoose.Schema.Types.ObjectId, // שדה זה יהיה מזהה של תינוק
            ref: 'Babies' // הפנייה לקולקציית התינוקות
        }]
}
,{timestamps:true})

module.exports= mongoose.model('User', UserSchema)