import { makeAutoObservable } from 'mobx';
import ProfileService from '../service/ProfileService';
import FileUtils from '../utils/fileUtils';

export default class ProfileStore {

    ban: boolean = false
    active: boolean = false
    friendProfile: boolean = false
    img: string = ''
    myImg: string = ''
    userImg: string = ''
    myStatus: string = ''
    userStatus: string = ''
    selectFile: File | null = null

    constructor() {
        makeAutoObservable(this);
    }

    setBan(ban: boolean) {
        this.ban = ban
    }

    setActive(active: boolean) {
        this.active = active
    }

    setFriendProfile(friendProfile: boolean) {
        this.friendProfile = friendProfile
    }

    setMyImg(myImg:string) {
        this.myImg = myImg
    }

    setUserImg(userImg:string) {
        this.userImg = userImg
    }

    setMyStatus(myStatus: string) {
        this.myStatus = myStatus
    }

    setUserStatus(userStatus: string) {
        this.userStatus = userStatus
    }

    setSelectFile(selectFile: File | null) {
        this.selectFile = selectFile
    }

    async createProfile(userId : string) {
        try{
            await ProfileService.createProfile(userId)
        } catch(e) {}
    }

    async getProfile(friendId: string) {
        try{
            const profile = await ProfileService.getProfile(friendId)
            const img = profile.data.img 
            return profile.data
        } catch(e){}
    }

    async getActiveProfile(friendId: string) {
        try {
            const profile = await ProfileService.getProfile(friendId)
            this.setActive(profile.data.active)
        } catch(e) {}
    }

    async checkActive(userId: string, active: boolean) {
        try {
            await ProfileService.checkActive(userId, active)
        } catch(e) {}
    }

    async uploadImg(userId: string) {
        try{
            if (this.selectFile) {
                const fileUtils = new FileUtils(undefined, undefined)
                const fileBytes = await fileUtils.readFileAsBase64(this.selectFile);
                this.setMyImg(fileBytes);
                await ProfileService.uploadImg(userId, this.myImg)
            }
        } catch(e) {

        }
    }

    async updateStatus(userId: string, status: string) {
        try{
            status = status.trim()
            if (status) {
                this.setMyStatus(status)
                await ProfileService.updateStatus(userId, status)
            }
        } catch(e) {
        }
    } 

    async checkBan(userId : string) {
        try {
           const response = await ProfileService.checkBan(userId);
           this.setBan(response.data)
        } catch (e) {

        }
    }
}