import { Server as SocketIOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { envs } from "../configurations/envs.js"; 

let io = null;

export const initSocketServer = (server) => {
  if (io) return io;

  io = new SocketIOServer(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket conectado:", socket.id);

  
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization || "").split(" ")[1];

    if (!token) {
      socket.emit("error", "Token requerido");
      socket.disconnect(true);
      return;
    }

    try {
      const payload = jwt.verify(token, envs.JWT_SECRET);
      const userId = payload.id || payload.idUser || payload.sub;
      if (!userId) {
        socket.emit("error", "Token inválido (sin id)");
        socket.disconnect(true);
        return;
      }

      // Unir al room del usuario para emitir notificaciones fácilmente
      const room = `user:${userId}`;
      socket.join(room);
      socket.data.userId = userId;

      socket.emit("connected", { msg: "Conectado a Socket.IO", userId });

      socket.on("disconnect", (reason) => {
        console.log(`Socket desconectado ${socket.id}: ${reason}`);
      });
    } catch (err) {
      console.log("Error verificando token socket:", err.message);
      socket.emit("error", "Token inválido");
      socket.disconnect(true);
    }
  });

  return io;
};

export const getIO = () => io;

export const sendNotificationToUser = (userId, payload = {}) => {
  if (!io) {
    console.warn("Socket.IO no inicializado");
    return;
  }
  const room = `user:${userId}`;
  io.to(room).emit("reservationStatusUpdated", payload);
  //el mensaje se esta emitiendo correctamente

  //Este mensaje en la consola lo dejo para que compuebe que si es esta funcionando el socket
  console.log("reservationStatusUpdated", payload)
};

