import { FastifyInstance, FastifyRequest } from "fastify";
import { addConnection, removeConnection } from "./utils/web-sockets-connect";

export const webSocketsRouter = async (app: FastifyInstance) => {
    app.get("/", { websocket: true }, (socket, req: FastifyRequest) => {
        socket.on("message", (message) => {
            const data = JSON.parse(message.toString());
            if (data.type === "subscribe" && req.headers.authorization!.split(" ")[1]) {
                try {
                    addConnection(req.user.id!, socket);
                    console.log("user added!");
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
