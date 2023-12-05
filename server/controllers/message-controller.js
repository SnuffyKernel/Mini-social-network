const messageService = require("../service/message-service");
const MessageDto = require("../dtos/message-dto");

class MessageController {
  async createChat(req, res, next) {
    try {
      const { receiverId, senderId } = req.body;
      const chat = await messageService.checkChat(senderId, receiverId);

      if (!chat) {
        await messageService.createChat(senderId, receiverId);
        res.status(201).json({ message: "Чат создан" });
      } else {
        res.status(400).json({ message: "Ошибка: Чат уже существует" });
      }
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const { text, receiverId, senderId } = req.body;

      const chat = await messageService.checkChat(senderId, receiverId);

      if (chat && text) {
        await messageService.sendMessage(chat, text, senderId, receiverId);
        res.status(201).json({ message: "Сообщение отправлено" });
      } else {
        res.status(400).json({ message: "Ошибка при отправке сообщения" });
      }
    } catch (error) {
      next(error);
    }
  }

  async getChat(req, res, next) {
    try {
      const { receiverId, senderId } = req.body;
      const chat = await messageService.checkChat(senderId, receiverId);
      if (chat) {
        const messages = chat.messages;
        const messagesDto = messages.map((message) => new MessageDto(message));
        res.status(200).json(messagesDto);
      } else {
        res.status(404).json("Чат не найден");
      }
    } catch (error) {
      next(error);
    }
  }

  async getMessage(req, res, next) {
    try {
      const { receiverId, senderId } = req.body;
      const chat = await messageService.checkChat(senderId, receiverId);
      if(chat) {
        const lastMessage = await messageService.getLastMessage(chat._id)

        if (lastMessage) {
          res.status(200).json(lastMessage)
        } else {
          res.status(200).json(receiverId);
        }
      }
      else {
        res.status(404).json("Чат не найден");
      }
    } catch (e) {
      next(e);
    }
  }

  async getFriend(req, res, next) {
    try {
      const { senderId } = req.body;
      const chat = await messageService.getFriend(senderId);

      if (chat) {
        const receiver = chat.flatMap((chat) => {
          let i = 0;
          let y = 0;
          return chat.users.filter((userId) => userId.toString() !== senderId.toString() ? ((i = 0), y++) : i++, y++ && (i >= 2 && y % 2 === 0 ? (userId) => senderId : null)).map((userId) => userId.toString());
        });
        res.status(200).json(receiver);
      } else {
        res.status(200).json(null);
      }
    } catch (error) {
      next(error);
    }
  }

  async delChat(req, res, next) {
    try {
      const {receiverId, senderId} = req.body
      const chat = await messageService.checkChat(senderId, receiverId);

      if(chat) {
        const del = await messageService.delChat(senderId, receiverId)

        if (del) {
          res.status(200).json("Чат успешно удалён")
        } else {
          res.status(400).json("Ошибка при удалении чата");
        }
      } else {
        res.status(404).json("чат не найден");
      }
    } catch(e) {
      next(e)
    }
  } 
}

module.exports = new MessageController();
