const express = require('express');
const router = express.Router();



const { isLoggedIn } = require('../middlewares/authMiddleware');
const { sentMessage, recieveMessage } = require('../controllers/messageController');


router.post('/:chatId', isLoggedIn , sentMessage)
router.get('/:chatId', isLoggedIn, recieveMessage)



module.exports = router;