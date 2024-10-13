// src/server.ts
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" }
// });

const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Replace "*" with your frontend URL if it's fixed
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3001;

interface Room {
  participants: string[];
  votes: { [username: string]: number };
}

const rooms: { [roomId: string]: Room } = {};

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  socket.on(
    "joinRoom",
    ({ roomId, username }: { roomId: string; username: string }) => {
      socket.join(roomId);
      if (!rooms[roomId]) {
        rooms[roomId] = { participants: [], votes: {} };
      }
      if (!rooms[roomId].participants.includes(username)) {
        rooms[roomId].participants.push(username);
      }
      io.to(roomId).emit("participants", rooms[roomId]);
    }
  );

  socket.on(
    "vote",
    ({
      roomId,
      username,
      points
    }: {
      roomId: string;
      username: string;
      points: number;
    }) => {
      if (rooms[roomId]) {
        rooms[roomId].votes[username] = points;
        const results = groupByPoints(rooms[roomId].votes);
        io.to(roomId).emit("participants", rooms[roomId]);
        io.to(roomId).emit("results", results);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Handle disconnection logic if necessary
  });
});

function groupByPoints(votes: { [username: string]: number }) {
  const grouped: { [points: string]: string[] } = {};
  for (const [user, points] of Object.entries(votes)) {
    const key = points.toString();
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(user);
  }
  return grouped;
}

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
