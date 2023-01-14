const express = require("express");
const multer = require("multer");
const { signupUser, loginUser } = require("../controllers/userController");
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
router.post("/signup", upload.single("picture"), signupUser);
router.post("/login", loginUser);

module.exports = router;