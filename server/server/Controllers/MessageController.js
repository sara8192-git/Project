const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User'); // חשוב שתהיה לך טבלת משתמשים עם תפקיד

exports.sendMessage = async (req, res) => {
  const { senderId, recipientId, content, chatRoomId } = req.body;

  // בדיקת תפקידים
  const sender = await User.findById(senderId);
  const recipient = await User.findById(recipientId);

  if (!sender || !recipient) return res.status(404).json({ error: 'User not found' });

  // רק הורה ואחות יכולים לדבר
  const validPair =
    (sender.role === 'Parent' && recipient.role === 'Nurse') ||
    (sender.role === 'Nurse' && recipient.role === 'Parent');

  if (!validPair) return res.status(403).json({ error: 'You are not allowed to chat with this user' });

  const message = await Message.create({
    senderId,
    recipientId,
    content,
    chatRoomId
  });

  await ChatRoom.findByIdAndUpdate(chatRoomId, { lastUpdated: new Date() });

  res.json(message);
};

exports.getMessagesByChatRoom = async (req, res) => {
  const { chatRoomId } = req.params;
  const messages = await Message.find({ chatRoomId }).sort({ timestamp: 1 });
  res.json(messages);
};
exports.markAsRead = async (req, res) => {
    const { messageId } = req.params;
  
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });
  
    message.read = true;
    await message.save();
  
    res.json({ success: true });
  };
  exports.deleteMessage = async (req, res) => {
    const { messageId } = req.params;
  
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });
  
    message.isDeleted = true;
    await message.save();
  
    res.json({ success: true });
  };
  exports.getLastMessagesForUser = async (req, res) => {
    
    const userId = req.params.userId;
  
    const rooms = await ChatRoom.find({ participants: userId });
  
    const lastMessages = await Promise.all(rooms.map(async room => {
      const lastMessage = await Message.findOne({ chatRoomId: room._id }).sort({ timestamp: -1 });
      return { room, lastMessage };
    }));
  
    res.json(lastMessages);
  };