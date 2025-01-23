import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { CustomException } from "../../common/exceptions/custom-exception";
import { uuidSchema } from "../../common/schemas/uuid.schema";
import { checkObjectiveExists } from "../objective/utils/check-objective-exists";
import { getUserByEmail } from "../user/utils/get-user-by-email";
import * as userObjectiveShareRepository from "./repository.user-objective-share";
import { createUserObjectiveShareSchema } from "./schemas/create-user-objective-share.schema";

export async function create(
    req: FastifyRequest<{
        Body: createUserObjectiveShareSchema;
        Params: uuidSchema;
    }>,
    rep: FastifyReply
) {
    const { id } = req.params;

    const objective = await checkObjectiveExists(id);

    const user = await getUserByEmail(req.body.email);

    const data = {
        userId: user.id,
        objectiveId: objective.id
    };

    if (user.id === req.user.id) {
        throw new CustomException(HttpStatusCode.CONFLICT, "You're trying to grant access on your objective", {
            publicMessage: "You're trying to grant access on your objective"
        });
    }

    if ((await userObjectiveShareRepository.findAccessByUserAndObjective(sqlCon, user.id, objective.id)) !== undefined) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Share already exists", {
            publicMessage: "Share already exists"
        });
    }

    await userObjectiveShareRepository.insert(sqlCon, data);

    req.server.mailer.sendMail({
        to: req.body.email,
        subject: `User Objective Share`,
        text: `User has shared objective with you! 
        Objective: ${JSON.stringify(objective)}`
    });

    return rep.code(HttpStatusCode.CREATED).send({
        message: "You've successfully shared a task with a user",
        user: {
            email: user.email,
            name: user.name
        },
        objective: objective
    });
}

export async function revoke(
    req: FastifyRequest<{
        Body: createUserObjectiveShareSchema;
        Params: uuidSchema;
    }>,
    rep: FastifyReply
) {
    const { id } = req.params;

    const objective = await checkObjectiveExists(id);

    const user = await getUserByEmail(req.body.email);

    const data = {
        userId: user.id,
        objectiveId: objective.id
    };

    if (user.id === req.user.id) {
        throw new CustomException(HttpStatusCode.CONFLICT, "You are trying to revoke access from yourself", {
            publicMessage: "You are trying to revoke access from yourself"
        });
    }

    if (!(await userObjectiveShareRepository.findAccessByUserAndObjective(sqlCon, user.id, objective.id))) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Sharing doesn't exist", {
            publicMessage: "Sharing doesn't exist"
        });
    }
    await userObjectiveShareRepository.remove(sqlCon, data);

    // TODO: return all users that have access to this objective
    return rep.code(HttpStatusCode.OK).send({
        message: "You've successfully revoked access",
        user: {
            email: user.email,
            name: user.name
        },
        objective: objective
    });
}

export async function getShared(req: FastifyRequest, rep: FastifyReply) {
    const sharedObjectives = await userObjectiveShareRepository.findAccessesByUserId(sqlCon, req.user.id!);

    return rep.code(HttpStatusCode.OK).send(sharedObjectives);
}
