exports.verifyChatAccess = async (req, res, next) => {
    const { chatRoomId } = req.params;
    const userId = req.user._id; // מתוך ה-token
  
    const room = await ChatRoom.findById(chatRoomId);
    if (!room) return res.status(404).json({ error: 'Chat room not found' });
  
    if (!room.participants.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
  
    next();
  };
  