import { WebSocket } from "ws";
import { activeConnections } from "../../web-sockets/utils/web-sockets-connect";

interface IMessage {
    type: string;
    objectiveId: string;
    message: string;
}

export const sendObjectiveNotification = (userId: string, message: IMessage) => {
    const socket = activeConnections.get(userId);
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    }
};
