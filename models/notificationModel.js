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
  const filter = { recieverId, senderId, notifType };
  const update = { username, picture };

  const notification = await this.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
  });
  return notification;
};

module.exports = mongoose.model("Notification", notificationSchema);
