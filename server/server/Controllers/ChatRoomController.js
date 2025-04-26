const ChatRoom = require('../models/ChatRoom');

exports.createChatRoom = async (req, res) => {
  const { participants } = req.body;

  // לוודא שיש בדיוק 2 משתתפים
  if (participants.length !== 2) return res.status(400).json({ error: 'Must have exactly 2 participants.' });

  // בדיקה אם חדר קיים
  const existingRoom = await ChatRoom.findOne({ participants: { $all: participants } });
  if (existingRoom) return res.json(existingRoom);

  // יצירה
  const newRoom = await ChatRoom.create({ participants });
  res.json(newRoom);
};

exports.getChatRoomsForUser = async (req, res) => {
  const userId = req.params.userId;
  const rooms = await ChatRoom.find({ participants: userId }).sort({ lastUpdated: -1 });
  res.json(rooms);
};
