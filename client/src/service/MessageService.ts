import $api from '../http'
import {AxiosResponse} from 'axios'
import { Message } from '../models/Message'

export default class MessageService {
    static createChat( receiverId: string, senderId: string): Promise<AxiosResponse<void>> {
        return $api.post<void>(`/create-chat`, {receiverId: receiverId, senderId: senderId})
    }

    static sendMessage(value: string, receiverId: string, senderId: string): Promise<AxiosResponse<void>> {
        return $api.post<void>(`/new-message`, {text: value, receiverId: receiverId, senderId: senderId })
    }

    static getChat( receiverId: string, senderId: string): Promise<AxiosResponse<Message[]>> {
        return $api.post<Message[]>(`/get-chat`, {receiverId: receiverId, senderId: senderId})
    }

    static getMessage( receiverId: string, senderId: string): Promise<AxiosResponse<any>> {
        return $api.post(`/get-message`, {receiverId: receiverId, senderId: senderId})
    }

    static getFriend(senderId: string): Promise<AxiosResponse<Array<string>>> {
        return $api.post<Array<string>>(`/get-friend`, {senderId: senderId})
    }

    static delChat(receiverId: string, senderId: string): Promise<AxiosResponse<void>> {
        return $api.post<void>(`/del-chat`, {receiverId: receiverId, senderId: senderId})
    }
}
