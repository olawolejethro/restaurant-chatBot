const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const chatSchema = new Schema({
  userId: { type: ObjectId, required: true, ref: "User" },
  chatMsg: { type: String, required: true, trim: true },
  isBotMsg: { type: Boolean, required: true },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
