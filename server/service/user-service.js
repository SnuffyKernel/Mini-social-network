const UserModel = require('../models/user-model')
const UserDto = require('../dtos/user-dto')
const ApiError = require("../exeptions/api-error");

class UserService {
  async userSearch(query) {
    const users = await UserModel.find({ login: { $regex: query, $options: "i" } });
    const usersDto = users.map((user) => new UserDto(user));

    return usersDto;
  }

  async getUser(id) {
    const user = await UserModel.findOne({ _id: { $in: id } });
    if (!user) {
      return next(ApiError.NotFound("Пользователь не найден"))
    }
    const userDto = new UserDto(user)
    return userDto
  }

  async getUsers(id) {
    const users = await UserModel.find({ _id: { $in: id } });
    const usersDto = users.map((user) => new UserDto(user));

    return usersDto;
  }
}

module.exports = new UserService();