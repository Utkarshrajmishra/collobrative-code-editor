const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`user connected ${socket.id}`);

  socket.on('getRoomID', payload => {
    console.log(payload)
  })

  socket.on("code", (payload) => {
    socket.broadcast.emit('getcode', payload)
  });

  socket.on("input", payload =>{
    socket.broadcast.emit('getinput', payload)
  });

  socket.on('output', payload =>{
    socket.broadcast.emit('getoutput', payload)
  });

});

server.listen(3001, () => {
  console.log("Server is running");
});
