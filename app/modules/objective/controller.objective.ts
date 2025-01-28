import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { CustomException } from "../../common/exceptions/custom-exception";
import { IGetByUuidFSchema } from "../../common/schemas/uuid.schema";
import * as userObjectiveShareRepository from "../user-objective-share/repository.user-objective-share";
import * as objectiveRepository from "./repository.objective";
import { ICreateObjectiveFSchema } from "./schemas/create-objective.schema";
import { IQueryParamsFSchema } from "./schemas/params-objective.schema";
import { IUpdateObjectiveFSchema } from "./schemas/update-objective.schema";
import { checkObjectiveExists } from "./utils/check-objective-exists";

export async function create(req: FastifyRequest<ICreateObjectiveFSchema>, rep: FastifyReply) {
    const objective = {
        ...req.body,
        creatorId: req.user.id!
    };

    const insertedObjective = await objectiveRepository.insert(sqlCon, objective);

    return rep.code(HttpStatusCode.CREATED).send({ ...insertedObjective });
}

export async function update(req: FastifyRequest<IUpdateObjectiveFSchema>, rep: FastifyReply) {
    const { id } = req.params;

    const updatedObject = await objectiveRepository.update(sqlCon, id, req.body);

    return rep.code(HttpStatusCode.OK).send({ ...updatedObject });
}

export async function findOne(req: FastifyRequest<IGetByUuidFSchema>, rep: FastifyReply) {
    const { id } = req.params;

    const objective = await checkObjectiveExists(id);

    if (req.user.id! !== objective.creatorId) {
        if (!(await userObjectiveShareRepository.findAccessByUserAndObjective(sqlCon, req.user.id!, objective.id))) {
            throw new CustomException(HttpStatusCode.FORBIDDEN, "Access denied", {
                publicMessage: { message: "You have no access to this objective" }
            });
        }
    }

    return rep.code(HttpStatusCode.OK).send({ ...objective });
}

export async function findAll(req: FastifyRequest<IQueryParamsFSchema>, rep: FastifyReply) {
    const objectives = await objectiveRepository.getAll(sqlCon, req.user.id!, req.query);

    return rep.code(HttpStatusCode.OK).send({ body: objectives.data, ...objectives.total });
}

export async function remove(req: FastifyRequest<IGetByUuidFSchema>, rep: FastifyReply) {
    const { id } = req.params;

    await objectiveRepository.remove(sqlCon, id);

    return rep.code(HttpStatusCode.OK).send({ message: "You've successfully deleted the objective" });
}
