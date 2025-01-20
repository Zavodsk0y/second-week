import { FastifyInstance } from "fastify";
import { uuidObjectiveFSchema } from "../../common/schemas/uuid-objective.schema";
import * as objectiveController from "./controller.objective";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";
import { updateObjectiveFSchema } from "./schemas/update-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/to-do", { schema: createObjectiveFSchema }, objectiveController.create);
    app.get("/to-do/:id", { schema: uuidObjectiveFSchema }, objectiveController.findOne);
    app.get("/to-do", {}, objectiveController.findAll);
    app.patch("/to-do/:id", { schema: updateObjectiveFSchema }, objectiveController.update);
};
