const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    recieverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notifType: {
      type: String,
    },
  },

  { timestamps: true }
);

notificationSchema.statics.newNotif = async function (
  username,
  picture,
  recieverId,
  senderId,
  notifType
) {
  const notification = await this.create({
    username,
    picture,
    recieverId,
    senderId,
    notifType,
  });
  return notification;
};

module.exports = mongoose.model("Notification", notificationSchema);
