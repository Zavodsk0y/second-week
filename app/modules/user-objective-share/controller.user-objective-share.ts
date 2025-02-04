import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { CustomException } from "../../common/exceptions/custom-exception";
import { IGetByUuidFSchema } from "../../common/schemas/uuid.schema";
import { checkObjectiveExists } from "../objective/utils/check-objective-exists";
import * as userRepository from "../user/repository.user";
import * as userObjectiveShareRepository from "./repository.user-objective-share";
import { IUserObjectiveShareFSchema } from "./schemas/user-objective-share.schema";

export async function create(req: FastifyRequest<IUserObjectiveShareFSchema>, rep: FastifyReply) {
    const { id } = req.params;

    const objective = await checkObjectiveExists(id);

    const usersIds = req.body.users.map((user) => user.id);

    const ownerIsAddingYourself = usersIds.some((userId) => {
        return userId === req.user.id;
    });

    if (ownerIsAddingYourself) {
        throw new CustomException(HttpStatusCode.CONFLICT, "You are trying to grant access to yourself", {
            publicMessage: "You are trying to grant access to yourself"
        });
    }

    const existingShares = await userObjectiveShareRepository.findAccessesByUsersAndObjective(sqlCon, usersIds, objective.id);

    if (existingShares.length > 0) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Sharing already exists", {
            publicMessage: {
                message: "Sharings already exist for these users",
                usersIds: existingShares.map((user) => user.userId)
            }
        });
    }

    const users = await userRepository.getUsersByIds(sqlCon, usersIds);

    for (const user of users) {
        await userObjectiveShareRepository.insert(sqlCon, { userId: String(user.id), objectiveId: objective.id });

        req.server.mailer.sendMail({
            to: user.email,
            subject: `User Objective Share`,
            text: `User has shared objective with you!
        Objective: ${JSON.stringify(objective)}`
        });
    }

    return rep.code(HttpStatusCode.CREATED).send({
        message: "You've successfully shared a task with a user/s",
        users: await userObjectiveShareRepository.findGrantedUsersByObjectiveId(sqlCon, objective.id),
        objective: objective
    });
}

export async function revoke(req: FastifyRequest<IUserObjectiveShareFSchema>, rep: FastifyReply) {
    const { id } = req.params;

    const objective = await checkObjectiveExists(id);

    const usersIds = req.body.users.map((user) => user.id);

    const ownerIsRevokingYourself = usersIds.some((userId) => {
        return userId === req.user.id;
    });

    if (ownerIsRevokingYourself) {
        throw new CustomException(HttpStatusCode.CONFLICT, "You are trying to take away your access", {
            publicMessage: "You are trying to take away your access"
        });
    }

    const existingShares = await userObjectiveShareRepository.findAccessesByUsersAndObjective(sqlCon, usersIds, objective.id);

    const existingUserIds = existingShares.map((share) => share.userId);

    const usersWithoutAccess = usersIds.filter((userId) => !existingUserIds.includes(userId));

    if (usersWithoutAccess.length > 0) {
        throw new CustomException(HttpStatusCode.CONFLICT, "Sharings aren't exist", {
            publicMessage: {
                message: "Sharings aren't exist for these users",
                usersIds: usersWithoutAccess
            }
        });
    }

    await userObjectiveShareRepository.removeByUsersIds(sqlCon, existingUserIds, objective.id);

    return rep.code(HttpStatusCode.OK).send({
        message: "You've successfully revoked access from users",
        users: await userObjectiveShareRepository.findGrantedUsersByObjectiveId(sqlCon, objective.id),
        objective: objective
    });
}

export async function getShared(req: FastifyRequest, rep: FastifyReply) {
    const sharedObjectives = await userObjectiveShareRepository.findAccessesByUserId(sqlCon, req.user.id!);

    return rep.code(HttpStatusCode.OK).send(sharedObjectives);
}

export async function getGrantedUsersForObjective(req: FastifyRequest<IGetByUuidFSchema>, rep: FastifyReply) {
    const { id } = req.params;

    const objective = await checkObjectiveExists(id);

    const users = await userObjectiveShareRepository.findGrantedUsersByObjectiveId(sqlCon, objective.id);

    return rep.code(HttpStatusCode.OK).send({
        objective: objective,
        users: users
    });
}
