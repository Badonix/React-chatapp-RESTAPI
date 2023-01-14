const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const createToken = (_id) => {
  return jwt.sign({ _id: _id }, process.env.SECRET, { expiresIn: "3d" });
};

const signupUser = async (req, res) => {
  const { email, username, password } = req.body;
  const picture = req.file.path;

  try {
    const user = await User.signup(email, password, username, picture);

    const token = createToken(user._id);
    res.status(200).json({ email, username, picture, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    console.log(user);
    const email = user.email;
    const picture = user.picture;
    res.status(200).json({ token, username, email, picture });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = { signupUser, loginUser };
