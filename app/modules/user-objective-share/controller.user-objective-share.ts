import { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { CustomException } from "../../common/exceptions/custom-exception";
import { IGetByUuidFSchema } from "../../common/schemas/uuid.schema";
import { Users } from "../../common/types/kysely/db.type";
import { checkObjectiveExists } from "../objective/utils/check-objective-exists";
import { getUserById } from "../user/utils/get-user-by-id";
import * as userObjectiveShareRepository from "./repository.user-objective-share";
import { IUserObjectiveShareFSchema } from "./schemas/user-objective-share.schema";

export async function create(req: FastifyRequest<IUserObjectiveShareFSchema>, rep: FastifyReply) {
    const { id } = req.params;

    const objective = await checkObjectiveExists(id);

    const usersIds = req.body.users;

    const users: Users[] = [];

    const ownerIsAddingYourself = usersIds.some((user) => {
        return user.id === req.user.id;
    });

    if (ownerIsAddingYourself) {
        throw new CustomException(HttpStatusCode.CONFLICT, "You are trying to grant access to yourself", {
            publicMessage: "You are trying to grant access to yourself"
        });
    }

    for (const user of usersIds) {
        const checkedUser = await getUserById(user.id);
        if ((await userObjectiveShareRepository.findAccessByUserAndObjective(sqlCon, user.id, objective.id)) !== undefined) {
            throw new CustomException(HttpStatusCode.CONFLICT, "Sharing already exists", {
                publicMessage: { message: "Sharing already exists for this user", userId: user.id }
            });
        }
        users.push(checkedUser);
    }

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

    const users = req.body.users;

    const ownerIsRevokingYourself = users.some((user) => {
        return user.id === req.user.id;
    });

    if (ownerIsRevokingYourself) {
        throw new CustomException(HttpStatusCode.CONFLICT, "You are trying to take away your access", {
            publicMessage: "You are trying to take away your access"
        });
    }

    for (const user of users) {
        if (!(await userObjectiveShareRepository.findAccessByUserAndObjective(sqlCon, user.id, objective.id))) {
            throw new CustomException(HttpStatusCode.CONFLICT, "Sharing doesn't exist for this user", {
                publicMessage: { message: "Sharing doesn't exist for this user", userId: user.id }
            });
        }
    }

    for (const user of users) {
        await userObjectiveShareRepository.remove(sqlCon, { userId: user.id, objectiveId: objective.id });
    }

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
