import $api from '../http'
import {AxiosResponse} from 'axios'
import { IUser } from '../models/IUser'

export default class AuthService {
    static getUser(userId: string): Promise<AxiosResponse<IUser>> {
        return $api.post<IUser>(`/get-user`, {userId: userId});
    }

    static getUsers(receiverId: any): Promise<AxiosResponse<any>> {
        return $api.post<IUser[]>(`/get-users`, {receiverId: receiverId});
    }

    static searchUsers(query: string): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>(`/users/search?query=${query}`);
    }
}
