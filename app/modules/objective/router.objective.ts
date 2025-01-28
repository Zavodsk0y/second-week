import { FastifyInstance } from "fastify";
import { uuidFSchema } from "../../common/schemas/uuid.schema";
import { checkSharingPolicy } from "../user-objective-share/policies/check-sharing-policy";
import * as objectiveController from "./controller.objective";
import { checkObjectivePolicyGet } from "./policies/check-objective-policy-get";
import { createObjectiveFSchema } from "./schemas/create-objective.schema";
import { paramsObjectiveFSchema } from "./schemas/params-objective.schema";
import { updateObjectiveFSchema } from "./schemas/update-objective.schema";

export const objectiveRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: createObjectiveFSchema }, objectiveController.create);
    app.get("/:id", { schema: uuidFSchema, preHandler: app.auth([checkObjectivePolicyGet, checkSharingPolicy]) }, objectiveController.findOne);
    app.get("/", { schema: paramsObjectiveFSchema }, objectiveController.findAll);
    app.patch("/:id", { schema: updateObjectiveFSchema, preHandler: app.auth([checkObjectivePolicyGet]) }, objectiveController.update);
    app.delete("/:id", { schema: uuidFSchema, preHandler: app.auth([checkObjectivePolicyGet]) }, objectiveController.remove);
};
