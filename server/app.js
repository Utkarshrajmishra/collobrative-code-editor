const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      "http://localhost:5173/code-editor/0eb7ce5e-266c-4d0c-80d4-7249990a2a27",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (payload) => {
    socket.join(payload);

    socket.on("code", (payload) => {
      socket.to(payload.id).emit("getcode", payload.code);
    });

    socket.on("getinput", (payload) => {
      socket.to(payload.id).emit("input", payload.input);
    });

    socket.on("getoutput", (payload) => {
      console.log(payload);
      socket.to(payload.id).emit("output", payload.output);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    socket.on("setLanguage", (payload) => {
      console.log(payload);
      socket.to(payload.id).emit("getLang", payload);
    });
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
