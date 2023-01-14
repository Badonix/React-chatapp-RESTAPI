const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT;
const DBURL = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);

const userRoutes = require("./routes/user");

const app = express();

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.use("/images", express.static("./images"));

app.use(express.json());
app.use(cors());

//routes
app.use("/api/users", userRoutes);

mongoose.set("strictQuery", true);
mongoose.connect(DBURL, () => {
  console.log("Connected to DB!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
