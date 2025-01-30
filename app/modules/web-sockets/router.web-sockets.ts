import { FastifyInstance } from "fastify";
import { WebSocket } from "ws";

export const activeConnections = new Map<string, WebSocket>();

export const webSocketsRouter = async (app: FastifyInstance) => {
    app.get("/", { websocket: true }, (socket) => {
        console.log("WebSocket connection opened");

        socket.on("message", (message) => {
            const data = JSON.parse(message.toString());
            if (data.type === "subscribe" && data.userId) {
                activeConnections.set(data.userId, socket);
                console.log(`User connected: ${data.userId}`);
            }
        });

        socket.on("close", () => {
            for (const [userId, ws] of activeConnections.entries()) {
                if (ws === socket) {
                    activeConnections.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
};
