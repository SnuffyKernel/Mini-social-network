const Profile = require("../models/profile-model")
const ApiError = require("../exeptions/api-error");

class ProfileService {
  async createProfile(userId) {
    if (await Profile.findOne({ userId: userId })) {
      throw ApiError.BadRequest(`Профиль уже существует `);
    }
    await Profile.create({ userId: userId, active: true });
  }

  async getProfile(userId) {
    if (userId) {
      const profiles = await Profile.findOne({ userId: userId });
      if (!profiles) {
        throw ApiError.BadRequest(`Пользователь не найден`);
      }

      return profiles;
    } else {
      return next(ApiError.NotFound("Пользователь не найден"));
    }
  }

  async checkActive(userId, active) {
    if (userId) {
      await Profile.updateOne({ userId: userId }, { active: active });
    } else {
      throw ApiError.NotFound("Пользователя нет");
    }
  }

  async uploadImg(userId, imgData) {
    if (userId) {
      await Profile.updateOne({ userId: userId }, { img: imgData });
    } else {
      throw ApiError.BadRequest("Ошибка");
    }
  }

  async updateStatus(userId, status) {
    if (userId) {
      await Profile.updateOne({ userId: userId }, { status: status });
    } else {
      throw ApiError.BadRequest("Ошибка");
    }
  }

  async setBan(userId, ban) {
    if (userId) {
      await Profile.updateOne({ userId: userId }, { ban: ban });
    } else {
      throw ApiError.BadRequest("Ошибка");
    }
  }

  async checkBan(userId, ban) {
    if (userId) {
      return await Profile.findOne({ userId: userId });
    } else {
      throw ApiError.BadRequest("Ошибка");
    }
  }
}

module.exports = new ProfileService()