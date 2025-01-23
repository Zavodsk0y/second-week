import type { FastifyInstance } from "fastify";
import * as userObjectiveShareController from "./controller.user-objective-share";
import { createuserObjectiveShareFSchema } from "./schemas/create-user-objective-share.schema";

export const userObjectiveShareRouter = async (app: FastifyInstance) => {
    app.post("/:id/accesses", { schema: createuserObjectiveShareFSchema }, userObjectiveShareController.create);
    app.delete("/:id/accesses", { schema: createuserObjectiveShareFSchema }, userObjectiveShareController.revoke);
    app.get("/shared", {}, userObjectiveShareController.getShared);
};
