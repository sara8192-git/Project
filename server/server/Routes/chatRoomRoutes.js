const express = require('express');
const router = express.Router();
const chatRoomController = require('../Controllers/ChatRoomController');

router.post('/', chatRoomController.createChatRoom);
router.get('/:userId', chatRoomController.getChatRoomsForUser);

module.exports = router;
