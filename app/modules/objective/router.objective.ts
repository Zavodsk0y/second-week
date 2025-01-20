import { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";
import { uuidObjectiveFSchema } from "./schemas/uuid-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/to-do", { schema: createObjectiveFSchema }, objectiveController.create);
    app.get("/to-do/:id", { schema: uuidObjectiveFSchema }, objectiveController.findOne);
};
