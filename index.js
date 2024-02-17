const express =require ("express")
const http=require("http")
const app=express()
const server=http.createServer(app)
const socket=require("socket.io")

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

server.listen(5000,()=>console.log("SERVER IS runing enjoy voice call and video call"))

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // code added by me
  socket.emit("me",socket.id)
  socket.on("disconnect",()=>{
    socket.broadcast.emit("callEnded")
  })

  socket.on("callUser",(data)=>{
    io.to(data.userToCall).emit("callUser",{signal:data.signalData,from:data.from, name:data.name})
  })
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user && user.socketId) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    } else {
      console.log("User not found or socketId is undefined");
    }
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
