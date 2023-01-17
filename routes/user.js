const express = require("express");
const multer = require("multer");
const {
  signupUser,
  loginUser,
  editUser,
  getUsers,
} = require("../controllers/userController");
const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });
router.post("/signup", upload.single("photo"), signupUser);
router.post("/login", loginUser);
router.put("/edit", upload.single("photo"), editUser);
router.post("/", getUsers);
module.exports = router;
