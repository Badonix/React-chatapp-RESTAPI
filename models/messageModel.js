const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  senderId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
});

messageSchema.statics.newMessage = async function (sender, receiver, content) {
  const message = new this({
    senderId: sender,
    receiverId: receiver,
    content,
  });
  const savedMessage = await message.save();
  return savedMessage;
};
module.exports = mongoose.model("Message", messageSchema);
