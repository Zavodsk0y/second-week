import { FastifyInstance } from "fastify";
import { uuidFSchema } from "../../common/schemas/uuid.schema";
import * as objectiveController from "./controller.objective";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";
import { paramsObjectiveFSchema } from "./schemas/params-objective.schema";
import { updateObjectiveFSchema } from "./schemas/update-objective.schema";
import { checkObjectivePolicyGet } from "./utils/check-objective-policy-get";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: createObjectiveFSchema }, objectiveController.create);
    app.get("/:id", { schema: uuidFSchema }, objectiveController.findOne);
    app.get("/", { schema: paramsObjectiveFSchema }, objectiveController.findAll);
    app.patch("/:id", { schema: updateObjectiveFSchema, preHandler: app.auth([checkObjectivePolicyGet]) }, objectiveController.update);
};
