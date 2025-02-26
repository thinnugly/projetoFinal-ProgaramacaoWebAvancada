const { Server } = require("socket.io");

let io; // Definir uma variável global para armazenar a instância do io

const setupSocket = (server) => {
    io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("register", (userId) => {
            socket.join(userId);
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
