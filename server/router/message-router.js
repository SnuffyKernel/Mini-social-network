const Router =  require('express').Router
const messageController = require("../controllers/message-controller")
const router = new Router()
const authMiddleware = require('../middlewares/auth-middleware')

router.post("/create-chat", authMiddleware, messageController.createChat)
router.post("/get-chat", authMiddleware,  messageController.getChat);
router.post("/get-message", authMiddleware, messageController.getMessage)
router.post("/new-message", authMiddleware, messageController.sendMessage);
router.post("/get-friend", authMiddleware, messageController.getFriend);
router.post("/del-chat", authMiddleware, messageController.delChat);

module.exports = router