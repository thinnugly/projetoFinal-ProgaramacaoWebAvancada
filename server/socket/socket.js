const { Server } = require("socket.io");

let io;

const setupSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", 
            methods: ["GET", "POST"],
            allowedHeaders: ["Authorization"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("register", (userId) => {
            socket.join(userId);
            console.log(`User ${socket.id} joined room ${userId}`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return { io }; 
};

// Função para obter a instância do io
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized yet");
    }
    return io;
};

module.exports = { setupSocket, getIO };
