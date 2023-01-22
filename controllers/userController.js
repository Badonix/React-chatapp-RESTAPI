const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const validator = require("validator");
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
    const id = user._id;
    res.status(200).json({ email, id, username, picture, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    const id = user._id;
    console.log(user);
    const email = user.email;
    const picture = user.picture;
    res.status(200).json({ token, id, username, email, picture });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const editUser = async (req, res) => {
  const newUsername = req.body.usernameUpdated;
  const newEmail = req.body.emailUpdated;
  const id = req.body.id;
  try {
    const isEmail = validator.isEmail(newEmail);
    if (!isEmail) {
      return res.status(400).json({ error: "Email is not in valid format" });
    }
    // Check if the new username or email already exists in the database
    const userWithSameUsername = await User.findOne({
      username: newUsername,
      _id: { $ne: id },
    });
    const userWithSameEmail = await User.findOne({
      email: newEmail,
      _id: { $ne: id },
    });

    if (userWithSameUsername) {
      return res.status(409).json({ error: "Username already taken" });
    }
    if (userWithSameEmail) {
      return res.status(409).json({ error: "Email already taken" });
    }

    // Update the user's profile
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (req.file) {
      user.picture = req.file.path;
    }
    user.username = newUsername;
    user.email = newEmail;
    await user.save();
    res.json(user);
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const getUsers = async (req, res) => {
  const id = req.body.id;
  try {
    const users = await User.find(
      { _id: { $ne: id } },
      "-password -createdAt -updatedAt -__v -__v"
    );

    res.status(200).json(users);
  } catch (error) {
    res.json(error.message);
  }
};

const getUser = async (req, res) => {
  const idd = req.params.id;
  try {
    const user = await User.findById(idd);
    const { id, username, email, picture, following, followers } = user;
    res.status(200).json({
      id,
      username,
      email,
      following: following,
      followers: followers,
      picture,
    });
  } catch (error) {
    res.json(error.message);
  }
};

const followUser = async (req, res) => {
  const { followToId, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (user.following.includes(followToId)) {
      return res.status(401).json({ message: "User already followed" });
    }
    await User.updateOne(
      { _id: user._id },
      { $push: { following: followToId } }
    );
    await User.updateOne(
      { _id: followToId },
      { $push: { followers: user._id } }
    );
    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while following the user", error });
  }
};

const unfollowUser = async (req, res) => {
  const { userToUnfollowId, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user.following.includes(userToUnfollowId)) {
      return res
        .status(401)
        .json({ message: "You are not following this user " });
    }
    await User.updateOne(
      { _id: user._id },
      { $pull: { following: userToUnfollowId } }
    );
    await User.updateOne(
      { _id: userToUnfollowId },
      { $pull: { followers: user._id } }
    );
    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while unfollowing the user", error });
  }
};

const getFollowers = async (req, res) => {
  const userId = req.body.id;
  User.findById(userId)
    .populate({
      path: "followers",
      select: "username email picture _id",
    })
    .exec(function (err, user) {
      res.json(user.followers);
    });
};
const getFollowings = async (req, res) => {
  const userId = req.body.id;
  User.findById(userId)
    .populate({
      path: "following",
      select: "username email picture _id",
    })
    .exec(function (err, user) {
      res.json(user.following);
    });
};

module.exports = {
  signupUser,
  followUser,
  getUser,
  getUsers,
  loginUser,
  editUser,
  unfollowUser,
  getFollowers,
  getFollowings,
};
