module.exports = class UserDto {
    login
    nickname
    id
    isActivated

    constructor(model){
        this.login = model.login
        this.nickname = model.nickname
        this.id = model._id
        this.isActivated = model.isActivated
    }
}