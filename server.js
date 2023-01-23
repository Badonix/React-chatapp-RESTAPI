const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT;
const DBURL = process.env.DB_URL.replace("<password>", process.env.DB_PASSWORD);
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const userRoutes = require("./routes/user");

io.on("connection", (socket) => {
  console.log("OOPAAAA");
  socket.emit("hello from server", "zdddd");

  // receive a message from the client
  socket.on("hello from client", (...args) => {
    // ...
  });
  socket.on("hello", (...args) => {
    console.log(args);
  });
});
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

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
