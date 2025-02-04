import type { FastifyInstance } from "fastify";
import { uuidFSchema } from "../../common/schemas/uuid.schema";
import { checkObjectivePolicyGet } from "../objective/policies/check-objective-policy-get";
import * as userObjectiveShareController from "./controller.user-objective-share";
import { userObjectiveShareFSchema } from "./schemas/user-objective-share.schema";

export const userObjectiveShareRouter = async (app: FastifyInstance) => {
    app.post("/:id/share", { schema: userObjectiveShareFSchema, preHandler: app.auth([checkObjectivePolicyGet]) }, userObjectiveShareController.create);
    app.delete("/:id/revoke", { schema: userObjectiveShareFSchema, preHandler: app.auth([checkObjectivePolicyGet]) }, userObjectiveShareController.revoke);
    app.get("/:id/list-grants", { schema: uuidFSchema, preHandler: app.auth([checkObjectivePolicyGet]) }, userObjectiveShareController.getGrantedUsersForObjective);
    app.get("/shared", {}, userObjectiveShareController.getShared);
};
