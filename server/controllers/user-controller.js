const userService = require('../service/user-service')

class UserController {
  async searchUsers(req, res, next) {
    try {
      const { query } = req.query;
      const searchResults = await userService.userSearch(query);
      res.json(searchResults);
    } catch (e) {
      next(e);
    }
  }

  async getUser (req, res, next) {
    try{
      const { userId } = req.body
      const userData = await userService.getUser(userId)
      res.status(200).json(userData)
    } catch(e) {
      next(e)
    }
  }

  async getUsers(req, res, next) {
    try {
      const { receiverId } = req.body;
      if (receiverId.data) {
        const friend = await userService.getUsers(receiverId.data);
        res.status(200).json(friend);
      } else {
        res.status(200).json(null)
      }
    } catch(e) {
      next(e)
    }
  }
}

module.exports = new UserController()