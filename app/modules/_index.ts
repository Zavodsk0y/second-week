import type { FastifyInstance } from "fastify";
import { objectiveRouter } from "./objective/router.objective";
import { userObjectiveShareRouter } from "./user-objective-share/router.user-objective-share";
import { userRouter } from "./user/router.user";

interface IProvider {
    instance: (app: FastifyInstance) => Promise<void>;
    prefix: string;
}

export const HttpProvider: IProvider[] = [
    { instance: userRouter, prefix: "user" },
    { instance: objectiveRouter, prefix: "to-do" },
    { instance: userObjectiveShareRouter, prefix: "to-do" }
];
