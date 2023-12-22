const profileService = require("../service/profile-service")

class ProfileController {

    async createProfile(req, res, next) {
        try{
            const { userId } = req.body;
            await profileService.createProfile(userId)
            res.status(200).json("Профиль успешно создан")
        } catch (e) {
            next(e)
        }
    }

    async getProfile(req, res, next) {
        try {
            const { friendId } = req.body
            const profile = await profileService.getProfile(friendId);
            res.status(200).json(profile)
        } catch(e) {
            next(e)
        }
    }

    async checkActive(req, res, next) {
        try{
            const { userId, active } = req.body
            await profileService.checkActive(userId, active);
            res.status(200).json("Активный")
        } catch(e) {
            next(e)
        }
    }

    async uploadImg(req, res, next) {
        try{
            const {userId, imgData} = req.body
            await profileService.uploadImg(userId, imgData)
            res.status(200).json("Изображение загружено")
        } catch (e) {
            next(e)
        }
    }

    async updateStatus(req, res, next) {
        try{
            const { userId, status } = req.body
            await profileService.updateStatus(userId, status)
            res.status(200).json("Статус обновлён");
        } catch (e) {
            next(e)
        }
    }

    async checkBan(req, res, next) {
        try {
            const { userId } = req.body
            const ban = await profileService.checkBan(userId)
            res.status(200).json(ban.ban);
        } catch(e) {
            next(e)
        }
    }
}

module.exports = new ProfileController()