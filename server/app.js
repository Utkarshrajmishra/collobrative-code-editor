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
      socket.to(payload.id).emit("output", payload.output);
    });

    socket.on("userCall", (payload) => {
      console.log("Call Emitted");
      socket
        .to(payload.to)
        .emit("incomingCall", { from: socket.id, offer: payload.offer });
    });

    socket.on("callAccepted", (payload)=>{
      socket
        .to(payload.to)
        .emit("callAccepted", { from: socket.id, offer: payload.offer });
    });

    socket.on("peerNegotiation", payload=>{
      socket.to(payload.to).emit("peerNegotiation", {from: socket.id, offer:payload.offer});
    });

    socket.on("negotationDone", (payload) => {
      socket
        .to(payload.to)
        .emit("peerNegotiationFinal", { from: socket.id, answer: payload.answer });
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
