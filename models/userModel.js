const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (email, password, username, url) {
  if (!email || !password || !url) {
    throw Error("Fill in all fields!");
  }
  if (!validator.isEmail(email)) {
    throw Error("This is definietly not an email");
  }
  const emailExists = await this.findOne({ email });
  if (emailExists) {
    throw Error("Email already in use");
  }
  const usernameExists = await this.findOne({ username });
  if (usernameExists) {
    throw Error("Username already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hash,
    username,
    picture: url,
  });
  return user;
};

userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("Fill in all fields!");
  }
  const user = await this.findOne({ username });
  if (!user) {
    throw Error("Credentials are not correct");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Credentials are not correct");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
