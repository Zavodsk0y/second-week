import type { FastifyReply, FastifyRequest } from "fastify";
import type { IHandlingResponseError } from "../../common/config/http-response";
import { sqlCon } from "../../common/config/kysely-config";
import { HandlingErrorType } from "../../common/enum/error-types";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { uuidObjectiveSchema } from "../../common/schemas/uuid-objective.schema";
import * as objectiveRepository from "./repository.objective";
import { createObjectiveSchema } from "./schemas/create-objective.schema";
import { paramsObjectiveSchema } from "./schemas/params-objective.schema";
import { updateObjectiveSchema } from "./schemas/update-objective.schema";

export async function create(req: FastifyRequest<{ Body: createObjectiveSchema }>, rep: FastifyReply) {
    const objective = {
        title: req.body.title,
        description: req.body.description,
        creatorId: req.user.id!,
        notifyAt: req.body.notifyAt
    };

    const insertedObjective = await objectiveRepository.insert(sqlCon, objective);

    return rep.code(HttpStatusCode.CREATED).send({ ...insertedObjective });
}

export async function update(
    req: FastifyRequest<{
        Body: updateObjectiveSchema;
        Params: uuidObjectiveSchema;
    }>,
    rep: FastifyReply
) {
    const { id } = req.params;

    const objective = await objectiveRepository.getById(sqlCon, id);

    // TODO: DRY violation, need to fix, think about objective - we really need it?
    if (!objective) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "id" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }

    const updatedObject = await objectiveRepository.update(sqlCon, id, req.body);

    return rep.code(HttpStatusCode.OK).send({ ...updatedObject });
}

export async function findOne(req: FastifyRequest<{ Params: uuidObjectiveSchema }>, rep: FastifyReply) {
    const { id } = req.params;

    const objective = await objectiveRepository.getById(sqlCon, id);

    // TODO: DRY violation, need to fix
    if (!objective) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "id" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }

    return rep.code(HttpStatusCode.OK).send({ ...objective });
}

export async function findAll(req: FastifyRequest<{ Querystring: paramsObjectiveSchema }>, rep: FastifyReply) {
    const objectives = await objectiveRepository.getAll(sqlCon, req.user.id!, req.query);

    return rep.code(HttpStatusCode.OK).send(objectives);
}
