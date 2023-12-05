module.exports = class MessageDto {
  text;
  sender;
  receiver;
  createdAt;

  constructor(model) {
    this.text = model.text;
    this.sender = model.sender;
    this.receiver = model.receiver;
    this.createdAt = model.createdAt;
  }
};
