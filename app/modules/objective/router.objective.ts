import { FastifyInstance } from "fastify";
import * as objectiveController from "./controller.objective";
import { createObjectiveResponseFSchema } from "./schemas/create-objective-response.schema";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post(
        "/to-do",
        {
            schema: {
                ...createObjectiveFSchema,
                response: {
                    201: createObjectiveResponseFSchema
                }
            }
        },
        objectiveController.create
    );
};
