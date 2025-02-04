import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { addConnection, removeConnection } from "./utils/web-sockets-connect";

interface ITokenJwtPayload extends jwt.JwtPayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
}

export const webSocketsRouter = async (app: FastifyInstance) => {
    app.get("/", { websocket: true, config: { isPublic: true } }, (socket) => {
        socket.on("message", (message) => {
            const data = JSON.parse(message.toString());
            if (data.type === "subscribe" && data.userId && data.token) {
                try {
                    const decoded = jwt.verify(data.token, process.env.JWT_SECRET!) as ITokenJwtPayload;
                    if (decoded.id === data.userId) {
                        addConnection(data.userId, socket);
                    }
                } catch {
                    socket.close();
                }
            }
        });
        socket.on("close", () => {
            removeConnection(socket);
        });
    });
};
