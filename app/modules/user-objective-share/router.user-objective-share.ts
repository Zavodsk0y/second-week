import type { FastifyInstance } from "fastify";
import { checkObjectivePolicyGet } from "../objective/utils/check-objective-policy-get";
import * as userObjectiveShareController from "./controller.user-objective-share";
import { createuserObjectiveShareFSchema } from "./schemas/create-user-objective-share.schema";

export const userObjectiveShareRouter = async (app: FastifyInstance) => {
    app.post("/:id/accesses", { schema: createuserObjectiveShareFSchema, preHandler: app.auth([checkObjectivePolicyGet]) }, userObjectiveShareController.create);
    app.delete("/:id/accesses", { schema: createuserObjectiveShareFSchema, preHandler: app.auth([checkObjectivePolicyGet]) }, userObjectiveShareController.revoke);
    app.get("/shared", {}, userObjectiveShareController.getShared);
};
