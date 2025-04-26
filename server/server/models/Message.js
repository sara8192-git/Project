const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
  content: { type: String },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  type: { type: String, default: 'text' }, // text, image, file
  babyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Baby' } // אופציונלי אם יש
});

module.exports = mongoose.model('Message', messageSchema);
