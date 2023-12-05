import $api from '../http'
import {AxiosResponse} from 'axios'
import { Profile  } from '../models/profile';

export default class ProfileService {
    
    static createProfile( userId: string): Promise<AxiosResponse<void>> {
        return $api.post(`/create-profile`, {userId: userId})
    }

    static getProfile(friendId: string): Promise<AxiosResponse<Profile>> {
        return $api.post<Profile>(`/get-profile`, {friendId: friendId})
    }

    static checkActive( userId: string, active: boolean): Promise<AxiosResponse<void>> {
        return $api.post(`/check-active`, {userId: userId, active: active})
    }

    static uploadImg(userId: string, imgData: string): Promise<AxiosResponse<void>> {
        return $api.post(`/upload-img`, {userId: userId, imgData: imgData})
    }

    static updateStatus(userId: string, status: string): Promise<AxiosResponse<void>> {
        return $api.post(`/update-status`, {userId: userId, status: status})
    }
}