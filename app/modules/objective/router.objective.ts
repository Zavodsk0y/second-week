import { FastifyInstance } from "fastify";
import { uuidObjectiveFSchema } from "../../common/schemas/uuid-objective.schema";
import * as objectiveController from "./controller.objective";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";
import { paramsObjectiveFSchema } from "./schemas/params-objective.schema";
import { updateObjectiveFSchema } from "./schemas/update-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: createObjectiveFSchema }, objectiveController.create);
    app.get("/:id", { schema: uuidObjectiveFSchema }, objectiveController.findOne);
    app.get("/", { schema: paramsObjectiveFSchema }, objectiveController.findAll);
    app.patch("/:id", { schema: updateObjectiveFSchema }, objectiveController.update);
};
