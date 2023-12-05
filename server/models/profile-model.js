const { Schema, model } = require("mongoose");

const ProfileSchema = new Schema({
  userId: { type: String, unique: true, required: true },
  active: { type: Boolean, required: true, default: false },
  lastActivity: { type: Date, required: false },
  img: { type: String, required: false },
  status: { type: String, required: false },
});

module.exports = model("Profile", ProfileSchema);
