import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { uuidObjectiveSchema } from "../../common/schemas/uuid-objective.schema";
import { checkObjectivePolicyGet } from "../objective/utils/check-objective-policy-get";
import { getUserByEmail } from "../user/utils/get-user-by-email";
import * as userObjectiveShareRepository from "./repository.user-objective-share";
import { createUserObjectiveShareSchema } from "./schemas/create-user-objective-share.schema";

export async function create(req: FastifyRequest<{ Body: createUserObjectiveShareSchema; Params: uuidObjectiveSchema }>, rep: FastifyReply) {
    const { id } = req.params;

    const objective = await checkObjectivePolicyGet(id, req);

    const user = await getUserByEmail(req.body.email);

    const data = {
        userId: user.id,
        objectiveId: objective.id
    };

    await userObjectiveShareRepository.insert(sqlCon, data);

    return rep.code(HttpStatusCode.CREATED).send({
        message: "You have successfully shared a task with a user",
        user: {
            email: user.email,
            name: user.name
        },
        objective: objective
    });
}
