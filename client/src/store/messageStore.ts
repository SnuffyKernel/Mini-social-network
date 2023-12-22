import { makeAutoObservable } from 'mobx';
import MessageService from '../service/MessageService';
import { Message } from '../models/Message'

export default class MessageStore {
  messages: Message[] = [];
  lastMessage: string =''
  value: string =''
  loading: boolean = false;
  checkChat: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setMessages(messages: Message[]) {
    this.messages = messages;
  }

  setLastMessage(lastMessage: string) {
    this.lastMessage = lastMessage
  }

  setValue(value: string) {
    this.value = value
  }

  setLoading(loading: boolean) {
    this.loading = loading;
  }

  setCheckChat(checkChat: boolean) {
    this.checkChat = checkChat;
  }

    async createChat(receiverId: string, senderId: string) {
      try{
        await MessageService.createChat(receiverId, senderId)
        await this.getChat(receiverId, senderId);
      } catch (e) {
        
      }
    }

    async sendMessage(receiverId: string, senderId: string) {
        if(this.value) {
            try{
              const currentValue = this.value
              this.setValue("");
              await MessageService.sendMessage(currentValue, receiverId, senderId);
            } catch (e){
              setTimeout(() => {
                this.sendMessage(receiverId, senderId)
              }, 500)
            }

        }
    }

    async getChat(receiverId: string, senderId: string) {
        try {
            const response = await MessageService.getChat(receiverId, senderId);
            if (response.data) {
                this.setMessages(response.data);
                this.setCheckChat(true);
            }
        } catch (error) {
            console.error('Error while fetching messages:', error);
        } finally {
            this.setLoading(false);
        }
    }

    async getMessage(receiverId: string, senderId: string) {
      try{
        const response = await MessageService.getChat(receiverId, senderId);
        return response
      } catch(e) {}
    }

    async delChat(receiverId: string, senderId: string) {
      try {
        await MessageService.delChat(receiverId, senderId)
        this.setCheckChat(false)
      } catch(e) {
        setTimeout(() => {
          this.delChat(receiverId, senderId)
        }, 500)
      }
    }
}