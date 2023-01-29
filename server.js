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

let onlineUsers = [];

const getUser = (uid) => {
  return onlineUsers.find((user) => user.uid == uid);
};

const addOnlineUser = (uid, socketId) => {
  !onlineUsers.some((user) => user.uid == uid) &&
    onlineUsers.push({ uid, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId != socketId);
};

io.on("connection", (socket) => {
  socket.on("new-user", (uid) => {
    addOnlineUser(uid, socket.id);
    let onlineUserIds = onlineUsers.map((el) => el.uid);
    socket.broadcast.emit("online-users", onlineUserIds);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    let onlineUserIds = onlineUsers.map((el) => el.uid);
    socket.broadcast.emit("online-users", onlineUserIds);
  });

  socket.on("followUser", (data) => {
    console.log(onlineUsers);
    const { followToId } = data;
    const { followerId } = data;
    console.log(followToId, followerId);
    const followToUser = getUser(followToId);
    console.log(followToUser);
    socket.to(followToUser.socketId).emit("followNotif", followerId);
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
