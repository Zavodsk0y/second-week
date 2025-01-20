import { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post(
        "/to-do",
        {
            schema: createObjectiveFSchema
        },
        objectiveController.create
    );
};
