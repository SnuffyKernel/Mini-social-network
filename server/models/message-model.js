const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({
  text: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const ChatSchema = new Schema({
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [MessageSchema],
});

const Message = model("Message", MessageSchema);
const Chat = model("Chat", ChatSchema);

module.exports = { Message, Chat };
