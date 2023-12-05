const { Message, Chat } = require("../models/message-model");

class MessageService {
  async checkChat(senderId, receiverId) {
    const chat = await Chat.findOne({
      $or: [
        { users: [senderId, receiverId] },
        { users: [receiverId, senderId] },
      ],
    });

    return chat;
  }

  async createChat(senderId, receiverId) {
    const newChat = new Chat({
      users: [senderId, receiverId],
      messages: [],
    });
    await newChat.save();
  }

  async sendMessage(chat, text, senderId, receiverId) {
    const message = new Message({
      text,
      sender: senderId,
      receiver: receiverId,
    });

    chat.messages.push(message);
    await chat.save();
  }

  async getLastMessage(chatId) {
    const chat = await Chat.findById(chatId);
    if (chat && chat.messages.length > 0) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return lastMessage;
    }
    return null;
  }

  async getFriend(senderId) {
    const chat = await Chat.find({
      users: { $in: [senderId] },
    });

    return chat;
  }

  async delChat(senderId, receiverId) {
    const del = await Chat.findOneAndDelete({
      $or: [
        { users: [senderId, receiverId] },
        { users: [receiverId, senderId] },
      ],
    });

    return del
  }
}

module.exports = new MessageService();
