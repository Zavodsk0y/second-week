import type { FastifyInstance } from "fastify";
import { objectiveRouter } from "./objective/router.objective";
import { userObjectiveShareRouter } from "./user-objective-share/router.user-objective-share";
import { userRouter } from "./user/router.user";
import { webSocketsRouter } from "./web-sockets/router.web-sockets";

interface IProvider {
    instance: (app: FastifyInstance) => Promise<void>;
    prefix: string;
}

export const HttpProvider: IProvider[] = [
    { instance: webSocketsRouter, prefix: "" },
    { instance: userRouter, prefix: "user" },
    { instance: objectiveRouter, prefix: "to-do" },
    { instance: userObjectiveShareRouter, prefix: "to-do" }
];
