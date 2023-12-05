const Router =  require('express').Router
const userController = require('../controllers/user-controller')
const router = new Router()
const authMiddleware = require('../middlewares/auth-middleware')

router.get("/users/search", authMiddleware, userController.searchUsers);
router.post("/get-user", authMiddleware, userController.getUser)
router.post("/get-users", authMiddleware, userController.getUsers)

module.exports = router