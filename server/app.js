const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://collobrative-code-editor.vercel.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", (payload) => {
    // const room = io.sockets.adapter.rooms.get(payload);

    // // Check if the room already has 2 participants
    // if (room && room.size >= 2) {
    //   socket.emit("roomFull", { message: "Room is full" });
    //   return;
    // }

    socket.join(payload);

    socket.on("code", (payload) => {
      socket.to(payload.id).emit("getcode", payload.code);
    });

    socket.on("getinput", (payload) => {
      socket.to(payload.id).emit("input", payload.input);
    });

    socket.on("getoutput", (payload) => {
      socket.to(payload.id).emit("output", payload.output);
    });

    socket.on("user:call", ({ to, offer }) => {
      socket.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
      socket.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
      socket.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
      // console.log("peer:nego:done", ans);
      socket.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    socket.on("setLanguage", (payload) => {
      socket.to(payload.id).emit("getLang", payload);
    });
  });
});

server.listen(8000, () => {
  console.log("Server is running on port 8000");
});
