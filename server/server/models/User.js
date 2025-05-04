const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    identity: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Secretary', 'Parent', 'Nurse', 'Admin'],
        default: 'Parent'

    },
    babies: {
        type: [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Babies' 
        }],
        default: function () {
            return this.role === 'Parent' ? [] : undefined;
        }
    },
    profilePicture: { // שדה חדש לשמירת נתיב התמונה
        type: String,
        allowNull: true, // לא חובה
    },
}
    , { timestamps: true })

module.exports = mongoose.model('User', UserSchema)