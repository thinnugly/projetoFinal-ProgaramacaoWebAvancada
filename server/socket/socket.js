const { Server } = require("socket.io");

let io;

const setupSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:8080",  // Para testes locais
                "https://taskmanagement-rmm-devwn.netlify.app"  // Frontend no Netlify
            ],
            methods: ["GET", "POST"],
            allowedHeaders: ["Authorization", "Content-Type"],
            credentials: true  
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Registrar usuário em uma sala específica (por exemplo, pelo ID do usuário)
        socket.on("register", (userId) => {
            socket.join(userId);
            console.log(`User ${socket.id} joined room ${userId}`);
        });

        // Enviar uma notificação para um usuário específico
        socket.on("sendNotification", ({ userId, message, notificationType }) => {
            io.to(userId).emit("notification", {
                message: message,
                notificationType: notificationType, 
                timestamp: new Date().toISOString()
            });
            console.log(`Notification sent to user ${userId}: ${message} (Type: ${notificationType})`);
        });

        // Lidar com desconexões
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });

    return { io }; 
};

// Função para enviar notificações de forma global ou para um usuário específico
const sendNotification = (userId, message, notificationType) => {
    if (!io) {
        throw new Error("Socket.io not initialized yet");
    }

    if (userId) {
        // Envia a notificação apenas para o usuário específico
        io.to(userId).emit("notification", {
            message: message,
            notificationType: notificationType,
            timestamp: new Date().toISOString()
        });
        console.log(`Notification sent to user ${userId}: ${message} (Type: ${notificationType})`);
    } else {
        // Envia a notificação para todos os usuários conectados
        io.emit("notification", {
            message: message,
            notificationType: notificationType,
            timestamp: new Date().toISOString()
        });
        console.log(`Global notification sent: ${message} (Type: ${notificationType})`);
    }
};

module.exports = { setupSocket, sendNotification };