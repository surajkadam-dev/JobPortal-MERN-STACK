import app from "./app.js";
import { connection } from "./database/connection.js";
import cloudinary from 'cloudinary'
import { Server } from "socket.io";
import http from "http";
const server=http.createServer(app)
cloudinary.v2.config(
  {
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_CLOUD_KEY,
  api_secret:process.env.CLOUDINARY_CLOUD_KEY_SECRETE
  }
)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});
app.set("io",io);
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("JOIN_USER", (userId) => {
    socket.join(userId); // userId room
    console.log(`User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});
server.listen(process.env.PORT,()=>
{
  
  console.log(`server running on ${process.env.PORT}`)
})