const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: "3d" });
};

const signupUser = async (req, res) => {
  const { email, username, password } = req.body;
  const url = req.file.path;

  try {
    const user = await User.signup(email, password, username, url);
    // let url = user.picture;
    const token = createToken(user._id);
    res.status(200).json({ email, username, url, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { signupUser };
