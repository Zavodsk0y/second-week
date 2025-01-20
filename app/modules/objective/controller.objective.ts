import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as objectiveRepository from "./repository.objective";
import { createObjectiveSchema } from "./schemas/create-objective.schema";

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
