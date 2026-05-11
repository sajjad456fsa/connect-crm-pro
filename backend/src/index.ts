import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import { config } from "./config";
import { prisma } from "./utils/prisma";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.on("joinRoom", (room) => socket.join(room));
  socket.on("leaveRoom", (room) => socket.leave(room));
});

const port = config.port;
server.listen(port, async () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
  await prisma.$connect();
});
