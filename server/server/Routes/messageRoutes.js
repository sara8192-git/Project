const express = require('express');
const router = express.Router();
const messageController = require('../Controllers/MessageController');

router.post('/', messageController.sendMessage);
router.get('/:chatRoomId', messageController.getMessagesByChatRoom);
router.patch('/read/:messageId', messageController.markAsRead);
router.delete('/:messageId', messageController.deleteMessage);
router.get('/lastMessages', messageController.getLastMessagesForUser);

module.exports = router;
