import { WebSocket } from "ws";

export const activeConnections = new Map<string, WebSocket>();

export const addConnection = (userId: string, socket: WebSocket) => {
    activeConnections.set(userId, socket);
};

export const removeConnection = (socket: WebSocket) => {
    for (const [userId, ws] of activeConnections.entries()) {
        if (ws === socket) {
            activeConnections.delete(userId);
            break;
        }
    }
};
